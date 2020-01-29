import {
    Length,
    IsObject,
    IsUrl,
    IsArray,
    IsOptional,
    IsString
} from 'class-validator';

import { Address } from './common';

export interface Supplies {
    name: string;
    type: 'face' | 'leg' | 'disinfection' | 'device' | 'other';
    remark: string;
    count: number;
}

export interface Contact {
    name: string;
    phone: string;
}

export class RequirementModel {
    @Length(5)
    hospital: string;

    @IsObject()
    address: Address;

    @IsUrl()
    url: string;

    @IsArray()
    supplies: Supplies[];

    @IsOptional()
    @IsArray()
    contacts?: Contact[];

    @IsOptional()
    @IsString()
    remark?: string;
}
