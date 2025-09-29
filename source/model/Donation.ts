import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { OrganizationBase } from './Place';

export class BankAccount {
    @IsString()
    name: string;

    @IsString()
    number: string;

    @IsString()
    bank: string;
}

@Entity()
export class DonationRecipient extends OrganizationBase {
    @Type(() => BankAccount)
    @ValidateNested({ each: true })
    @Column('simple-json')
    accounts: BankAccount[];
}
