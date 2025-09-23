import { Type } from 'class-transformer';
import {
    Length,
    IsMilitaryTime,
    IsString,
    IsOptional,
    IsArray,
    IsBoolean,
    ValidateNested,
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserBase, User } from './User';
import { Contact } from './Place';

@Entity()
export class Clinic extends UserBase {
    @IsString()
    @Length(2)
    @Column()
    name: string;

    @IsMilitaryTime()
    @Column()
    startTime: string;

    @IsMilitaryTime()
    @Column()
    endTime: string;

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
