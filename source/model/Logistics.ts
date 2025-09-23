import { Type } from 'class-transformer';
import {
    Length,
    IsUrl,
    IsArray,
    IsOptional,
    IsString,
    IsBoolean,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserBase, User } from './User';
import { Contact } from './Place';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

@Entity()
export class Logistics extends UserBase {
    @IsString()
    @Length(3)
    @Column()
    name: string;

    @IsUrl()
    @Column()
    url: string;

    @IsArray()
    @Column('simple-json')
    contacts: Contact[];

    @IsArray()
    @Column('simple-json')
    serviceArea: ServiceArea[];

    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    remark?: string;

    @IsBoolean()
    @Column({ default: false })
    verified: boolean;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    verifier?: User;
}

export class LogisticsModel {
    @Length(3)
    name: string;

    @IsUrl()
    url: string;

    @IsArray()
    contacts: Contact[];

    @IsArray()
    serviceArea: ServiceArea[];

    @IsOptional()
    @IsString()
    remark?: string;
}
