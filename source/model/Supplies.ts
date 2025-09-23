import { Type } from 'class-transformer';
import {
    Length,
    IsArray,
    IsString,
    IsOptional,
    IsBoolean,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserBase, User } from './User';
import { GeoCoord, Contact } from './Place';

export interface Supplies {
    name: string;
    type: 'face' | 'leg' | 'disinfection' | 'device' | 'other';
    remark: string;
    count: number;
}

@Entity()
export class SuppliesRequirement extends UserBase {
    @IsString()
    @Length(5)
    @Column()
    hospital: string;

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


