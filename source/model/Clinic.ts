import { Length, IsMilitaryTime } from 'class-validator';

import { OrganizationModel } from './Place';

export class ClinicModel extends OrganizationModel {
    @Length(2)
    name: string;

    @IsMilitaryTime()
    startTime: string;

    @IsMilitaryTime()
    endTime: string;
}
