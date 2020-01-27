import {
    IsMobilePhone,
    Length,
    IsUrl,
    IsEnum,
    IsPositive
} from 'class-validator';

export enum Gender {
    Male,
    Female,
    Other
}

export class UserModel {
    @IsMobilePhone('zh-CN')
    mobilePhoneNumber: string;

    @Length(3)
    name?: string;

    @IsEnum(Gender)
    gender?: Gender;

    @IsPositive()
    age?: number;

    @IsUrl()
    avatar?: string;
}

export enum UserRole {
    Admin = 'Admin'
}
