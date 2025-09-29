import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

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
