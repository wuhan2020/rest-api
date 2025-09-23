import {
    JsonController,
    Authorized,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Ctx,
    OnUndefined,
    BadRequestError,
    NotFoundError
} from 'routing-controllers';

import { AuthenticatedContext, generateToken } from '../utility';
import { UserRole, UserModel, User, dataSource } from '../model';

interface SignInToken {
    phone?: string;
    code?: string;
    email?: string;
    password?: string;
}

interface SignUpData {
    name: string;
    email?: string;
    phone?: string;
    password: string;
}

const { ROOT_ACCOUNT } = process.env;

@JsonController('/session')
export class SessionController {
    @Post('/smsCode')
    sendSMSCode(@Body() { phone }: SignInToken) {
        // For now, return a mock response since we removed LeanCloud SMS
        // In production, you'd integrate with SMS service like Twilio, AWS SNS, etc.
        if (!phone) {
            throw new BadRequestError('Phone number is required');
        }
        return { message: 'SMS code sent successfully' };
    }

    @Post('/signup')
    async signUp(@Body() { name, email, phone, password }: SignUpData) {
        const userRepo = dataSource.getRepository(User);
        
        // Check if user already exists
        const existingUser = await userRepo.findOne({
            where: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ mobilePhoneNumber: phone }] : [])
            ]
        });

        if (existingUser) {
            throw new BadRequestError('User already exists with this email or phone');
        }

        const user = new User();
        user.name = name;
        user.email = email;
        user.mobilePhoneNumber = phone;
        user.roles = [];

        // For ROOT_ACCOUNT, assign Admin role
        if ((phone === ROOT_ACCOUNT) || (email === ROOT_ACCOUNT)) {
            user.roles = [UserRole.Admin];
        }

        const savedUser = await userRepo.save(user);
        const token = generateToken(savedUser);

        return {
            user: savedUser,
            token
        };
    }

    @Post('/')
    async signIn(
        @Body() { phone, code, email, password }: SignInToken,
        @Ctx() context: AuthenticatedContext
    ) {
        const userRepo = dataSource.getRepository(User);
        
        let user: User | null = null;

        if (phone && code) {
            // SMS code authentication
            // For demo purposes, accept any code for now
            // In production, verify the SMS code against your SMS service
            user = await userRepo.findOne({ 
                where: { mobilePhoneNumber: phone } 
            });
            
            if (!user) {
                // Create new user for phone-based sign up
                user = new User();
                user.name = phone; // Use phone as default name
                user.mobilePhoneNumber = phone;
                user.roles = [];
                
                if (phone === ROOT_ACCOUNT) {
                    user.roles = [UserRole.Admin];
                }
                
                user = await userRepo.save(user);
            }
        } else if (email) {
            // Email authentication
            user = await userRepo.findOne({ where: { email } });
        }

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const token = generateToken(user);
        context.state.user = user;

        return {
            user,
            token
        };
    }

    @Get('/')
    @Authorized()
    getProfile(@Ctx() { state: { user } }: AuthenticatedContext) {
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    @Patch('/')
    @Authorized()
    async editProfile(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Body() body: UserModel
    ) {
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const userRepo = dataSource.getRepository(User);
        
        // Update user properties
        Object.assign(user, body);
        
        const updatedUser = await userRepo.save(user);
        return updatedUser;
    }

    @Delete('/')
    @Authorized()
    @OnUndefined(204)
    destroy(@Ctx() context: AuthenticatedContext) {
        // Clear the user from context (logout)
        context.state.user = undefined;
        context.state.jwtdata = undefined;
    }
}
