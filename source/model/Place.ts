import { Length, IsObject } from 'class-validator';

export interface GeoCoord {
    latitude: number;
    longitude: number;
}

export class Place {
    @Length(3)
    province: string;

    @Length(3)
    city: string;

    @Length(2)
    district: string;

    @Length(5)
    address: string;

    @IsObject()
    coords: GeoCoord;
}
