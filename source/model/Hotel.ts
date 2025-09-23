import { Type } from 'class-transformer';
import {
    Length,
    IsPositive,
    IsString,
    IsOptional,
    IsArray,
    IsBoolean,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserBase, User } from './User';
import { GeoCoord, Contact } from './Place';

@Entity()
export class Hotel extends UserBase {
    @IsString()
    @Length(2)
    @Column()
    name: string;

    @IsPositive()
    @Column()
    capacity: number;

    @IsString()
    @Length(3)
    @Column()
    province: string;

    @IsString()
    @Length(3)
    @Column()
    city: string;

    @IsString()
    @Length(2)
    @Column()
    district: string;

    @IsString()
    @Length(5)
    @Column()
    address: string;

    @Column('simple-json')
    coords: GeoCoord;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    url?: string;

    @IsArray()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    contacts?: Contact[];

    @IsString()
    @IsOptional()
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

export class HotelModel {
    @Length(2)
    name: string;

    @IsPositive()
    capacity: number;

    @Length(3)
    province: string;

    @Length(3)
    city: string;

    @Length(2)
    district: string;

    @Length(5)
    address: string;

    coords: GeoCoord;

    @IsOptional()
    url?: string;

    @IsOptional()
    @IsArray()
    contacts?: Contact[];

    @IsOptional()
    @IsString()
    remark?: string;
}
