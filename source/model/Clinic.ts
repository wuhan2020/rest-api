import { Type } from 'class-transformer';
import { IsInt, Min, IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { OrganizationBase } from './Place';

@Entity()
export class Clinic extends OrganizationBase {
    @IsString()
    @Column()
    startTime: string;

    @IsString()
    @Column()
    endTime: string;
}

export class ClinicListChunk implements ListChunk<Clinic> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Clinic)
    @ValidateNested({ each: true })
    list: Clinic[];
}
