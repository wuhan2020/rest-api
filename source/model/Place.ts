import { Type } from 'class-transformer';
import {
    Length,
    IsPhoneNumber,
    IsUrl,
    IsOptional,
    IsLatitude,
    IsLongitude,
    IsString,
    ValidateNested,
    IsBoolean,
} from 'class-validator';
import { Column, ManyToOne } from 'typeorm';

import { User, UserBase } from './User';

export class GeoCoord {
    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;
}

export class Contact {
    @IsString()
    name: string;

    @IsPhoneNumber()
    phone: string;
}

export abstract class OrganizationBase extends UserBase {
    @IsString()
    @Length(2)
    @Column({ unique: true })
    name: string;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    url?: string;

    @IsOptional()
    @Type(() => Contact)
    @ValidateNested({ each: true })
    @Column('simple-json', { nullable: true })
    contacts?: Contact[];

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

export abstract class PlaceBase extends OrganizationBase {
    @Length(3)
    @Column()
    province: string;

    @Length(3)
    @Column()
    city: string;

    @Length(2)
    @Column()
    district: string;

    @Length(5)
    @Column()
    address: string;

    @Type(() => GeoCoord)
    @ValidateNested()
    @Column('simple-json')
    coords: GeoCoord;
}
