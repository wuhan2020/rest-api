import { Length, IsArray } from 'class-validator';

import { PlaceModel } from './Place';

export interface Supplies {
    name: string;
    type: 'face' | 'leg' | 'disinfection' | 'device' | 'other';
    remark: string;
    count: number;
}

export class RequirementModel extends PlaceModel {
    @Length(5)
    hospital: string;

    @IsArray()
    supplies: Supplies[];
}
