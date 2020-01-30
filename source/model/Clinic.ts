import { Length, IsDateString } from 'class-validator';

import { OrganizationModel } from './Place';

export class ClinicModel extends OrganizationModel {
    @Length(2)
    name: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;
}
