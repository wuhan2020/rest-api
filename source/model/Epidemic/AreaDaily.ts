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

import { Base, ListChunk } from '../Base';

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

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    provinceConfirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    provinceSuspectedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    provinceCuredCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    provinceDeadCount?: number;

    @IsDateString()
    @IsOptional()
    @Column('date', { nullable: true })
    updateTime?: string;

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
    cityConfirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    citySuspectedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    cityCuredCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    cityDeadCount?: number;
}

export class AreaDailyListChunk implements ListChunk<EpidemicAreaDaily> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicAreaDaily)
    @ValidateNested({ each: true })
    list: EpidemicAreaDaily[];
}
