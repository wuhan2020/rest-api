import { Length, IsPositive } from 'class-validator';

import { PlaceModel } from './Place';

export class HotelModel extends PlaceModel {
    @Length(2)
    name: string;

    @IsPositive()
    capacity: number;
}
