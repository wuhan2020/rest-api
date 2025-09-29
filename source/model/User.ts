import { Type } from 'class-transformer';
import {
    IsOptional,
    IsInt,
    IsString,
    IsDateString,
    IsEnum,
    IsJWT,
    IsMobilePhone,
    IsEmail,
    IsUrl,
    IsStrongPassword,
    Min,
    ValidateNested,
    IsBoolean,
} from 'class-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { NewData } from 'mobx-restful';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base, BaseFilter, InputData, ListChunk } from './Base';

export enum Gender {
    Female = 0,
    Male = 1,
    Other = 2,
}

export enum UserRole {
    Admin,
    Worker,
    Client,
}

export type UserInputData<T> = NewData<Omit<T, keyof UserBase>, Base>;

export class UserFilter extends BaseFilter implements Partial<InputData<User>> {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsMobilePhone()
    @IsOptional()
    mobilePhone?: string;

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

export class EmailSignInData implements Required<Pick<User, 'email' | 'password'>> {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export interface JWTAction {
    context?: ParameterizedContext<{ jwtOriginalError: JsonWebTokenError } | { user: User }>;
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

    @IsDateString()
    @IsOptional()
    @Column({ type: 'date', nullable: true })
    birthday?: string;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    avatar?: string;

    @IsEmail()
    @IsOptional()
    @Column({ nullable: true })
    email?: string;

    @IsMobilePhone()
    @IsOptional()
    @Column({ nullable: true })
    mobilePhone?: string;

    @IsStrongPassword()
    @IsOptional()
    @Column({ nullable: true, select: false })
    password?: string;

    @IsEnum(UserRole, { each: true })
    @IsOptional()
    @Column('simple-json')
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
    createdBy: User;

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

export abstract class VerificationBase extends UserBase {
    @IsDateString()
    @IsOptional()
    @Column({ type: 'date', nullable: true })
    verifiedAt?: string;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    verifiedBy?: User;
}

export class UserBaseFilter extends BaseFilter implements Partial<InputData<UserBase>> {
    @IsInt()
    @Min(1)
    @IsOptional()
    createdBy?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    updatedBy?: number;
}

export class VerificationBaseFilter
    extends UserBaseFilter
    implements Partial<InputData<VerificationBase>>
{
    @IsBoolean()
    @IsOptional()
    verified?: boolean;
}
