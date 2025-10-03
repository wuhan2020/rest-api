import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsPostalCode,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { Base, BaseFilter, InputData, ListChunk } from '../Base';

@Entity()
export class EpidemicAreaDaily extends Base {
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    continentName?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    continentEnglishName?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    countryName?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    countryEnglishName?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    provinceName?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    provinceEnglishName?: string;

    @IsPostalCode()
    @IsOptional()
    @Column({ nullable: true })
    provinceZipCode?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    cityName?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    cityEnglishName?: string;

    @IsPostalCode()
    @IsOptional()
    @Column({ nullable: true })
    cityZipCode?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    confirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    suspectedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    curedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    deadCount?: number;

    @IsDateString()
    @IsOptional()
    @Column('date', { nullable: true })
    updateTime?: string;
}

export type EpidemicAreaReport = Pick<
    EpidemicAreaDaily,
    | 'updateTime'
    | `${'continent' | 'country' | 'province' | 'city'}Name`
    | `${'suspected' | 'confirmed' | 'cured' | 'dead'}Count`
>;

export class EpidemicAreaFilter extends BaseFilter implements InputData<EpidemicAreaReport> {
    @IsDateString()
    @IsOptional()
    updateTime?: string;

    @IsString()
    @IsOptional()
    continentName?: string;

    @IsString()
    @IsOptional()
    countryName?: string;

    @IsString()
    @IsOptional()
    provinceName?: string;

    @IsString()
    @IsOptional()
    cityName?: string;
}

export class AreaDailyListChunk implements ListChunk<EpidemicAreaDaily> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicAreaDaily)
    @ValidateNested({ each: true })
    list: EpidemicAreaDaily[];
}
