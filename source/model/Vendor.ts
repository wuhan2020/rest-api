import { Type } from 'class-transformer';
import { Length, IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

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
