import { Type } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsInt,
    IsJWT,
    IsMobilePhone,
    IsOptional,
    IsString,
    IsUrl,
    IsPositive,
    Length,
    Min,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { NewData } from 'mobx-restful';

import { Base, BaseFilter, InputData, ListChunk } from './Base';

export enum Gender {
    Female = 0,
    Male = 1,
    Other = 2,
}

export enum UserRole {
    Admin = 'Admin',
    Manager = 'Manager',
    User = 'User',
}

export type UserInputData<T> = NewData<Omit<T, keyof UserBase>, Base>;

export class UserFilter extends BaseFilter implements Partial<InputData<User>> {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsMobilePhone('zh-CN')
    @IsOptional()
    mobilePhoneNumber?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;
}

export class UserListChunk implements ListChunk<User> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => User)
    @ValidateNested({ each: true })
    list: User[];
}

export class UserModel {
    @IsMobilePhone('zh-CN')
    mobilePhoneNumber: string;

    @Length(3)
    name?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @IsPositive()
    @IsOptional()
    age?: number;

    @IsUrl()
    @IsOptional()
    avatar?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
}

@Entity()
export class User extends Base {
    @IsString()
    @Column()
    name: string;

    @IsEnum(Gender)
    @IsOptional()
    @Column({ type: 'simple-enum', enum: Gender, nullable: true })
    gender?: Gender;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    avatar?: string;

    @IsEmail()
    @IsOptional()
    @Column({ unique: true, nullable: true })
    email?: string;

    @IsMobilePhone('zh-CN')
    @IsOptional()
    @Column({ unique: true, nullable: true })
    mobilePhoneNumber?: string;

    @IsPositive()
    @IsOptional()
    @Column({ nullable: true })
    age?: number;

    @IsEnum(UserRole, { each: true })
    @IsOptional()
    @Column('simple-json', { default: [] })
    roles: UserRole[];

    @IsJWT()
    @IsOptional()
    token?: string;
}

export abstract class UserBase extends Base {
    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    createdBy?: User;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    updatedBy?: User;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    deletedBy?: User;
}

export class UserBaseFilter
    extends BaseFilter
    implements Partial<InputData<UserBase>>
{
    @IsInt()
    @Min(1)
    @IsOptional()
    createdBy?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    updatedBy?: number;
}
