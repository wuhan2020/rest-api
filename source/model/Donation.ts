import { Length, IsArray } from 'class-validator';

import { OrganizationModel } from './Place';

export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}

export class DonationRecipientModel extends OrganizationModel {
    @Length(2)
    name: string;

    @IsArray()
    accounts: BankAccount[];
}
