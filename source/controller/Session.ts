import { User } from 'leanengine';
import { Cloud } from 'leancloud-storage';
import {
    JsonController,
    Authorized,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Ctx,
    OnUndefined
} from 'routing-controllers';

import { LCContext } from '../utility';
import { UserRole, UserModel } from '../model';
import { RoleController } from './Role';
import { UserController } from './User';

interface SignInToken {
    phone: string;
    code?: string;
}

const { ROOT_ACCOUNT } = process.env;

@JsonController('/session')
export class SessionController {
    @Post('/smsCode')
    sendSMSCode(@Body() { phone }: SignInToken) {
        return Cloud.requestSmsCode(phone);
    }

    @Post('/')
    async signIn(
        @Body() { phone, code }: SignInToken,
        @Ctx() context: LCContext
    ) {
        const user = await User.signUpOrlogInWithMobilePhone(phone, code);

        context.saveCurrentUser(user);

        if (phone === ROOT_ACCOUNT && !(await RoleController.isAdmin(user)))
            await RoleController.create(UserRole.Admin, user);

        return UserController.getUserWithRoles(user);
    }

    @Get('/')
    @Authorized()
    getProfile(@Ctx() { currentUser: { id } }: LCContext) {
        return UserController.getUserWithRoles(id);
    }

    @Patch('/')
    @Authorized()
    async editProfile(
        @Ctx() { currentUser: user }: LCContext,
        @Body() body: UserModel
    ) {
        return (await user.save(body, { user })).toJSON();
    }

    @Delete('/')
    @Authorized()
    @OnUndefined(204)
    destroy(@Ctx() context: LCContext) {
        context.currentUser.logOut();
        context.clearCurrentUser();
    }
}
