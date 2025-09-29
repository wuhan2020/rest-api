import { Type } from 'class-transformer';
import { IsInt, Min, IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
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

export class DonationRecipientListChunk implements ListChunk<DonationRecipient> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => DonationRecipient)
    @ValidateNested({ each: true })
    list: DonationRecipient[];
}
