import { Length, IsArray } from 'class-validator';

import { PlaceModel } from './Place';
import { Supplies } from './Supplies';

export class VendorModel extends PlaceModel {
    @Length(2)
    name: string;

    @Length(5)
    qualification: string;

    @IsArray()
    supplies: Supplies[];
}
