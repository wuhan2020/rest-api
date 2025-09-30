import { Type } from 'class-transformer';
import { IsEnum, IsString, IsInt, Min, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { PlaceBase } from './Place';

export enum SuppliesType {
    face = 'face',
    leg = 'leg',
    disinfection = 'disinfection',
    device = 'device',
    other = 'other',
}

export class Supplies {
    @IsString()
    name: string;

    @IsEnum(SuppliesType)
    @Column('simple-enum', { enum: SuppliesType })
    type: SuppliesType;

    @IsString()
    remark: string;

    @IsInt()
    @Min(0)
    count: number;
}

@Entity()
export class SuppliesRequirement extends PlaceBase {
    @Type(() => Supplies)
    @ValidateNested({ each: true })
    @Column('simple-json')
    supplies: Supplies[];
}

export class SuppliesRequirementListChunk implements ListChunk<SuppliesRequirement> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => SuppliesRequirement)
    @ValidateNested({ each: true })
    list: SuppliesRequirement[];
}
