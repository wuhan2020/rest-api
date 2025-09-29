import { IsInt, Min } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { PlaceBase } from './Place';

@Entity()
export class Hotel extends PlaceBase {
    @IsInt()
    @Min(1)
    @Column()
    capacity: number;
}
