import { Type } from 'class-transformer';
import { IsInt, Min, IsString, Length, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { PlaceBase } from './Place';
import { Supplies } from './Supplies';

@Entity()
export class Vendor extends PlaceBase {
    @IsString()
    @Length(5)
    @Column()
    qualification: string;

    @Type(() => Supplies)
    @ValidateNested({ each: true })
    @Column('simple-json')
    supplies: Supplies[];
}

export class VendorListChunk implements ListChunk<Vendor> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Vendor)
    @ValidateNested({ each: true })
    list: Vendor[];
}
