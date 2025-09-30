import { Type } from 'class-transformer';
import {
    IsUrl,
    IsEnum,
    IsOptional,
    IsInt,
    Min,
    IsString,
    Length,
    IsBoolean,
    ValidateNested,
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { VerificationBase } from './User';
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
export class Logistics extends VerificationBase {
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
}

export class LogisticsListChunk implements ListChunk<Logistics> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Logistics)
    @ValidateNested({ each: true })
    list: Logistics[];
}
