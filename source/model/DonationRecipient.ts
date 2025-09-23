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
import { Contact } from './Place';

export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}

@Entity()
export class DonationRecipient extends UserBase {
    @IsString()
    @Length(2)
    @Column()
    name: string;

    @IsArray()
    @Column('simple-json')
    accounts: BankAccount[];

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


