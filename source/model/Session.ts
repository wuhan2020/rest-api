import { IsMobilePhone, IsOptional, IsString, IsUrl } from 'class-validator';

import { User } from './User';

export class Captcha {
    @IsString()
    token: string;

    @IsUrl()
    link: string;
}

export class SMSCodeInput {
    @IsMobilePhone()
    mobilePhone: string;

    @IsString()
    @IsOptional()
    captchaToken?: string;

    @IsString()
    @IsOptional()
    captchaCode?: string;
}

export class PhoneSignInData implements Required<Pick<User, 'mobilePhone' | 'password'>> {
    @IsMobilePhone()
    mobilePhone: string;

    @IsString()
    password: string;
}
