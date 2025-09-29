import { Type } from 'class-transformer';
import {
    Length,
    IsUrl,
    IsEnum,
    IsOptional,
    IsString,
    IsBoolean,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserBase, User } from './User';
import { Contact } from './Place';

export enum LogisticsDirection {
    in = 'in',
    out = 'out',
    both = 'both',
}

export class ServiceArea {
    @IsString()
    city: string;

    @IsEnum(LogisticsDirection)
    @Column('simple-enum', { enum: LogisticsDirection })
    direction: LogisticsDirection;

    @IsBoolean()
    @Column({ default: false })
    personal: boolean;
}

@Entity()
export class Logistics extends UserBase {
    @IsString()
    @Length(3)
    @Column({ unique: true })
    name: string;

    @IsUrl()
    @Column()
    url: string;

    @Type(() => Contact)
    @ValidateNested({ each: true })
    @Column('simple-json')
    contacts: Contact[];

    @Type(() => ServiceArea)
    @ValidateNested({ each: true })
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
