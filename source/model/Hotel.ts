import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { PlaceBase } from './Place';

@Entity()
export class Hotel extends PlaceBase {
    @IsInt()
    @Min(1)
    @Column()
    capacity: number;
}

export class HotelListChunk implements ListChunk<Hotel> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Hotel)
    @ValidateNested({ each: true })
    list: Hotel[];
}
