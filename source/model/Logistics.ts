import { Length, IsUrl, IsArray, IsOptional, IsString } from 'class-validator';
import { Contact } from './Supplies';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

export class LogisticsModel {
    @Length(3)
    name: string;

    @IsUrl()
    url: string;

    @IsArray()
    contacts: Contact[];

    @IsArray()
    serviceArea: ServiceArea[];

    @IsOptional()
    @IsString()
    remark?: string;
}
