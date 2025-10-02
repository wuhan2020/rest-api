import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ViewColumn, ViewEntity } from 'typeorm';

import { ListChunk } from '../Base';
import { EpidemicAreaDaily } from './AreaDaily';

@ViewEntity({
    expression: connection =>
        connection
            .createQueryBuilder()
            .from(EpidemicAreaDaily, 'ead')
            .where('ead.countryName IS NOT NULL')
            .groupBy('ead.countryName')
            .addGroupBy("strftime('%Y-%m', ead.updateTime)")
            .select('ead.countryName', 'countryName')
            .addSelect('ead.countryEnglishName', 'countryEnglishName')
            .addSelect("strftime('%Y-%m', ead.updateTime)", 'month')
            .addSelect('SUM(ead.provinceConfirmedCount)', 'confirmedCount')
            .addSelect('SUM(ead.provinceSuspectedCount)', 'suspectedCount')
            .addSelect('SUM(ead.provinceCuredCount)', 'curedCount')
            .addSelect('SUM(ead.provinceDeadCount)', 'deadCount')
})
export class CountryMonthlyStats {
    @IsString()
    @ViewColumn()
    countryName: string;

    @IsString()
    @IsOptional()
    @ViewColumn()
    countryEnglishName?: string;

    @IsString()
    @ViewColumn()
    month: string;

    @IsInt()
    @Min(0)
    @ViewColumn()
    confirmedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    suspectedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    curedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    deadCount: number;
}

export class CountryMonthlyStatsListChunk implements ListChunk<CountryMonthlyStats> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => CountryMonthlyStats)
    @ValidateNested({ each: true })
    list: CountryMonthlyStats[];
}

@ViewEntity({
    expression: connection =>
        connection
            .createQueryBuilder()
            .from(EpidemicAreaDaily, 'ead')
            .where('ead.provinceName IS NOT NULL')
            .groupBy('ead.countryName')
            .addGroupBy('ead.provinceName')
            .addGroupBy("strftime('%Y-%m', ead.updateTime)")
            .select('ead.countryName', 'countryName')
            .addSelect('ead.provinceName', 'provinceName')
            .addSelect('ead.provinceEnglishName', 'provinceEnglishName')
            .addSelect("strftime('%Y-%m', ead.updateTime)", 'month')
            .addSelect('SUM(ead.provinceConfirmedCount)', 'confirmedCount')
            .addSelect('SUM(ead.provinceSuspectedCount)', 'suspectedCount')
            .addSelect('SUM(ead.provinceCuredCount)', 'curedCount')
            .addSelect('SUM(ead.provinceDeadCount)', 'deadCount')
})
export class ProvinceMonthlyStats {
    @IsString()
    @ViewColumn()
    countryName: string;

    @IsString()
    @ViewColumn()
    provinceName: string;

    @IsString()
    @IsOptional()
    @ViewColumn()
    provinceEnglishName?: string;

    @IsString()
    @ViewColumn()
    month: string;

    @IsInt()
    @Min(0)
    @ViewColumn()
    confirmedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    suspectedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    curedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    deadCount: number;
}

export class ProvinceMonthlyStatsListChunk implements ListChunk<ProvinceMonthlyStats> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => ProvinceMonthlyStats)
    @ValidateNested({ each: true })
    list: ProvinceMonthlyStats[];
}

@ViewEntity({
    expression: connection =>
        connection
            .createQueryBuilder()
            .from(EpidemicAreaDaily, 'ead')
            .where('ead.cityName IS NOT NULL')
            .groupBy('ead.provinceName')
            .addGroupBy('ead.cityName')
            .addGroupBy("strftime('%Y-%m', ead.updateTime)")
            .select('ead.provinceName', 'provinceName')
            .addSelect('ead.cityName', 'cityName')
            .addSelect('ead.cityEnglishName', 'cityEnglishName')
            .addSelect("strftime('%Y-%m', ead.updateTime)", 'month')
            .addSelect('SUM(ead.cityConfirmedCount)', 'confirmedCount')
            .addSelect('SUM(ead.citySuspectedCount)', 'suspectedCount')
            .addSelect('SUM(ead.cityCuredCount)', 'curedCount')
            .addSelect('SUM(ead.cityDeadCount)', 'deadCount')
})
export class CityMonthlyStats {
    @IsString()
    @ViewColumn()
    provinceName: string;

    @IsString()
    @ViewColumn()
    cityName: string;

    @IsString()
    @IsOptional()
    @ViewColumn()
    cityEnglishName?: string;

    @IsString()
    @ViewColumn()
    month: string;

    @IsInt()
    @Min(0)
    @ViewColumn()
    confirmedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    suspectedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    curedCount: number;

    @IsInt()
    @Min(0)
    @ViewColumn()
    deadCount: number;
}

export class CityMonthlyStatsListChunk implements ListChunk<CityMonthlyStats> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => CityMonthlyStats)
    @ValidateNested({ each: true })
    list: CityMonthlyStats[];
}
