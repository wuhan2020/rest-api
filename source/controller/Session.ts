import {
    JsonController,
    Authorized,
    Get,
    Post,
    Body,
    CurrentUser,
    HttpCode,
    OnUndefined
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { uniqueID } from 'web-utility';

import { dataSource, Captcha, SMSCodeInput, PhoneSignInData, User } from '../model';
import { leanClient } from '../utility';
import { UserController } from './User';

const userStore = dataSource.getRepository(User);

@JsonController('/session')
export class SessionController {
    @Post('/captcha')
    @ResponseSchema(Captcha)
    async createCaptcha() {
        const { body } =
            await leanClient.get<Record<`captcha_${'token' | 'url'}`, string>>('requestCaptcha');

        return { token: body.captcha_token, link: body.captcha_url };
    }

    static async verifyCaptcha(captcha_token: string, captcha_code: string) {
        const { body } = await leanClient.post<{ validate_token: string }>('verifyCaptcha', {
            captcha_code,
            captcha_token
        });
        return { token: body.validate_token };
    }

    @Post('/session/SMS-code')
    @OnUndefined(201)
    async createSMSCode(@Body() { captchaToken, captchaCode, mobilePhone }: SMSCodeInput) {
        if (captchaToken && captchaCode)
            var { token } = await SessionController.verifyCaptcha(captchaToken, captchaCode);

        await leanClient.post<{}>('requestSmsCode', {
            mobilePhoneNumber: mobilePhone,
            validate_token: token
        });
    }

    static verifySMSCode = (mobilePhoneNumber: string, code: string) =>
        leanClient.post<{}>(`verifySmsCode/${code}`, { mobilePhoneNumber });

    @Post('/')
    @HttpCode(201)
    @ResponseSchema(User)
    async signIn(@Body() { mobilePhone, password }: PhoneSignInData): Promise<User> {
        let user = await userStore.findOneBy({
            mobilePhone,
            password: UserController.encrypt(password)
        });

        if (!user) {
            await SessionController.verifySMSCode(mobilePhone, password);

            user =
                (await userStore.findOneBy({ mobilePhone })) ||
                (await UserController.signUp({ mobilePhone, password: uniqueID() }));
        }
        return UserController.sign(user);
    }

    @Get('/')
    @Authorized()
    @ResponseSchema(User)
    getSession(@CurrentUser() user: User) {
        return user;
    }
}
