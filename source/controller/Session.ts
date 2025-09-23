import {
    JsonController,
    Authorized,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    CurrentUser,
    OnUndefined,
    BadRequestError,
    NotFoundError,
    HttpCode
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { sign } from 'jsonwebtoken';

import { 
    dataSource, 
    User, 
    UserRole,
    APP_SECRET 
} from '../model';

interface SMSCodeRequest {
    mobilePhoneNumber: string;
}

interface SignInPhoneRequest {
    mobilePhoneNumber: string;
    verificationCode: string;
}

interface SignInEmailRequest {
    email: string;
    password?: string;
}

interface SignInResponse {
    user: User;
    token: string;
}

const { ROOT_ACCOUNT } = process.env;
const store = dataSource.getRepository(User);

@JsonController('/session')
export class SessionController {
    static signToken(user: User) {
        return sign(
            { id: user.id, name: user.name, roles: user.roles },
            APP_SECRET,
            { expiresIn: '7d' }
        );
    }

    @Post('/smsCode')
    @OnUndefined(204)
    async sendSMSCode(@Body() { mobilePhoneNumber }: SMSCodeRequest) {
        // TODO: Integrate with LeanCloud SMS service for production
        // For development, return mock response
        if (!mobilePhoneNumber) {
            throw new BadRequestError('Phone number is required');
        }
        
        console.log(`Mock SMS code sent to: ${mobilePhoneNumber}`);
        
        // For production with LeanCloud SMS:
        // const AV = require('leancloud-storage');
        // return AV.Cloud.requestSmsCode(mobilePhoneNumber);
        
        return;
    }

    @Post('/phone')
    @HttpCode(201)
    @ResponseSchema(SignInResponse)
    async signInWithPhone(
        @Body() { mobilePhoneNumber, verificationCode }: SignInPhoneRequest
    ): Promise<SignInResponse> {
        if (!verificationCode) {
            throw new BadRequestError('Verification code is required');
        }

        // TODO: Verify SMS code with LeanCloud or SMS service
        // For demo purposes, accept any non-empty code
        
        let user = await store.findOne({ where: { mobilePhoneNumber } });

        if (!user) {
            // Create new user for phone sign-up (following LeanCloud pattern)
            user = new User();
            user.name = mobilePhoneNumber; // Use phone as default name
            user.mobilePhoneNumber = mobilePhoneNumber;
            user.roles = [];

            // Check if this is the root account
            if (mobilePhoneNumber === ROOT_ACCOUNT) {
                user.roles = [UserRole.Admin];
            }

            user = await store.save(user);
        }

        const token = SessionController.signToken(user);
        return { user, token };
    }

    @Post('/email')
    @HttpCode(201) 
    @ResponseSchema(SignInResponse)
    async signInWithEmail(
        @Body() { email, password }: SignInEmailRequest
    ): Promise<SignInResponse> {
        let user = await store.findOne({ where: { email } });

        if (!user) {
            // Create new user for email sign-up
            user = new User();
            user.name = email.split('@')[0]; // Use email prefix as default name
            user.email = email;
            user.roles = [];

            // Check if this is the root account
            if (email === ROOT_ACCOUNT) {
                user.roles = [UserRole.Admin];
            }

            user = await store.save(user);
        }

        const token = SessionController.signToken(user);
        return { user, token };
    }

    // Legacy endpoint for backward compatibility
    @Post('/')
    @HttpCode(201)
    @ResponseSchema(SignInResponse)
    async signIn(
        @Body() body: SignInPhoneRequest & SignInEmailRequest
    ): Promise<SignInResponse> {
        if (body.mobilePhoneNumber && body.verificationCode) {
            return this.signInWithPhone(body);
        } else if (body.email) {
            return this.signInWithEmail(body);
        } else {
            throw new BadRequestError('Either phone+code or email is required');
        }
    }

    @Get('/')
    @Authorized()
    @ResponseSchema(User)
    async getProfile(@CurrentUser() user: User) {
        if (!user) {
            throw new NotFoundError('User not found');
        }
        
        const freshUser = await store.findOne({ where: { id: user.id } });
        if (!freshUser) {
            throw new NotFoundError('User not found');
        }
        
        return freshUser;
    }

    @Patch('/')
    @Authorized()
    @ResponseSchema(User)
    async editProfile(
        @CurrentUser() user: User,
        @Body() { roles, ...data }: User
    ) {
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (roles && !user.roles.includes(UserRole.Admin)) {
            throw new BadRequestError('Only admins can modify roles');
        }

        const updatedUser = await store.save({
            ...data,
            id: user.id,
            roles: roles || user.roles
        });

        return updatedUser;
    }

    @Delete('/')
    @Authorized()
    @OnUndefined(204)
    async destroy() {
        // JWT tokens are stateless, so logout is handled client-side
        // by discarding the token
        return;
    }
}
