import { Type } from 'class-transformer';
import {
    Length,
    IsArray,
    IsString,
    IsBoolean,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserBase, User } from './User';
import { GeoCoord, Contact } from './Place';
import { Supplies } from './Supplies';

@Entity()
export class Vendor extends UserBase {
    @IsString()
    @Length(2)
    @Column({ unique: true })
    name: string;

    @IsString()
    @Length(5)
    @Column()
    qualification: string;

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

    @IsArray()
    @Column('simple-json')
    supplies: Supplies[];

    @IsBoolean()
    @Column({ default: false })
    verified: boolean;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    verifier?: User;
}


