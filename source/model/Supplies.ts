import { Length, IsArray, IsOptional } from 'class-validator';

interface Contact {
    name: string;
    phone: string;
}

export class RequirementModel {
    @Length(5)
    hospital: string;

    @Length(10)
    address: string;

    @IsArray()
    coords: number[];

    @IsArray()
    supplies: string[];

    @IsOptional()
    @IsArray()
    contacts?: Contact[];
}
