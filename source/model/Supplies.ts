import { Length, IsUrl, IsArray, IsOptional, IsString } from 'class-validator';

import { Place } from './Place';

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

export class RequirementModel extends Place {
    @Length(5)
    hospital: string;

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
