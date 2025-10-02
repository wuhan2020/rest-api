import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ViewColumn, ViewEntity } from 'typeorm';

import { BaseFilter, ListChunk } from '../Base';
import { EpidemicAreaDaily } from './AreaDaily';

abstract class EpidemicMonthly {
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

@ViewEntity({
    expression: connection => {
        const qb = connection
            .createQueryBuilder()
            .from(EpidemicAreaDaily, 'ead')
            .where('ead.countryName IS NOT NULL')
            .groupBy('ead.countryName');
        const monthExpression =
            connection.options.type === 'postgres'
                ? "TO_CHAR(ead.updateTime, 'YYYY-MM')"
                : "strftime('%Y-%m', ead.updateTime)";
        return qb
            .addGroupBy(monthExpression)
            .select('ead.countryName', 'countryName')
            .addSelect('ead.countryEnglishName', 'countryEnglishName')
            .addSelect(monthExpression, 'month')
            .addSelect('SUM(ead.provinceConfirmedCount)', 'confirmedCount')
            .addSelect('SUM(ead.provinceSuspectedCount)', 'suspectedCount')
            .addSelect('SUM(ead.provinceCuredCount)', 'curedCount')
            .addSelect('SUM(ead.provinceDeadCount)', 'deadCount');
    }
})
export class EpidemicCountryMonthly extends EpidemicMonthly {
    @IsString()
    @ViewColumn()
    countryName: string;

    @IsString()
    @IsOptional()
    @ViewColumn()
    countryEnglishName?: string;
}

export class EpidemicMonthlyFilter extends BaseFilter {
    @IsString()
    @IsOptional()
    superior?: string;
}

export class EpidemicCountryMonthlyListChunk implements ListChunk<EpidemicCountryMonthly> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicCountryMonthly)
    @ValidateNested({ each: true })
    list: EpidemicCountryMonthly[];
}

@ViewEntity({
    expression: connection => {
        const qb = connection
            .createQueryBuilder()
            .from(EpidemicAreaDaily, 'ead')
            .where('ead.provinceName IS NOT NULL')
            .groupBy('ead.countryName')
            .addGroupBy('ead.provinceName');
        const monthExpression =
            connection.options.type === 'postgres'
                ? "TO_CHAR(ead.updateTime, 'YYYY-MM')"
                : "strftime('%Y-%m', ead.updateTime)";
        return qb
            .addGroupBy(monthExpression)
            .select('ead.countryName', 'countryName')
            .addSelect('ead.provinceName', 'provinceName')
            .addSelect('ead.provinceEnglishName', 'provinceEnglishName')
            .addSelect(monthExpression, 'month')
            .addSelect('SUM(ead.provinceConfirmedCount)', 'confirmedCount')
            .addSelect('SUM(ead.provinceSuspectedCount)', 'suspectedCount')
            .addSelect('SUM(ead.provinceCuredCount)', 'curedCount')
            .addSelect('SUM(ead.provinceDeadCount)', 'deadCount');
    }
})
export class EpidemicProvinceMonthly extends EpidemicMonthly {
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
}

export class EpidemicProvinceMonthlyListChunk implements ListChunk<EpidemicProvinceMonthly> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicProvinceMonthly)
    @ValidateNested({ each: true })
    list: EpidemicProvinceMonthly[];
}

@ViewEntity({
    expression: connection => {
        const qb = connection
            .createQueryBuilder()
            .from(EpidemicAreaDaily, 'ead')
            .where('ead.cityName IS NOT NULL')
            .groupBy('ead.provinceName')
            .addGroupBy('ead.cityName');
        const monthExpression =
            connection.options.type === 'postgres'
                ? "TO_CHAR(ead.updateTime, 'YYYY-MM')"
                : "strftime('%Y-%m', ead.updateTime)";
        return qb
            .addGroupBy(monthExpression)
            .select('ead.provinceName', 'provinceName')
            .addSelect('ead.cityName', 'cityName')
            .addSelect('ead.cityEnglishName', 'cityEnglishName')
            .addSelect(monthExpression, 'month')
            .addSelect('SUM(ead.cityConfirmedCount)', 'confirmedCount')
            .addSelect('SUM(ead.citySuspectedCount)', 'suspectedCount')
            .addSelect('SUM(ead.cityCuredCount)', 'curedCount')
            .addSelect('SUM(ead.cityDeadCount)', 'deadCount');
    }
})
export class EpidemicCityMonthly extends EpidemicMonthly {
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
}

export class EpidemicCityMonthlyListChunk implements ListChunk<EpidemicCityMonthly> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicCityMonthly)
    @ValidateNested({ each: true })
    list: EpidemicCityMonthly[];
}
