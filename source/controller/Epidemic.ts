import {
    Authorized,
    Body,
    Get,
    JsonController,
    Param,
    Post,
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { FindOptionsWhere, IsNull, Not } from 'typeorm';

import {
    AreaDailyListChunk,
    BaseFilter,
    dataSource,
    EpidemicAreaDaily,
    EpidemicAreaFilter,
    EpidemicCityMonthly,
    EpidemicCityMonthlyListChunk,
    EpidemicCountryMonthly,
    EpidemicCountryMonthlyListChunk,
    EpidemicMonthlyFilter,
    EpidemicNews,
    EpidemicOverall,
    EpidemicProvinceMonthly,
    EpidemicProvinceMonthlyListChunk,
    EpidemicRumor,
    NewsListChunk,
    OverallListChunk,
    RumorListChunk,
    UserRole
} from '../model';
import { BaseService } from '../service';

@JsonController('/epidemic/news')
export class EpidemicNewsController {
    service = new BaseService(EpidemicNews, ['title', 'summary', 'body', 'category', 'tag']);

    @Post()
    @Authorized(UserRole.Admin)
    @ResponseSchema(EpidemicNews)
    createOne(@Body() data: EpidemicNews) {
        return this.service.createOne(data);
    }

    @Get('/:id')
    @ResponseSchema(EpidemicNews)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Get()
    @ResponseSchema(NewsListChunk)
    getList(@QueryParams() filter: BaseFilter) {
        return this.service.getList(filter);
    }
}

@JsonController('/epidemic/rumor')
export class EpidemicRumorController {
    service = new BaseService(EpidemicRumor, [
        'title',
        'summary',
        'body',
        'mainSummary',
        'rumorType'
    ]);

    @Post()
    @Authorized(UserRole.Admin)
    @ResponseSchema(EpidemicRumor)
    createOne(@Body() data: EpidemicRumor) {
        return this.service.createOne(data);
    }

    @Get('/:id')
    @ResponseSchema(EpidemicRumor)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Get()
    @ResponseSchema(RumorListChunk)
    getList(@QueryParams() filter: BaseFilter) {
        return this.service.getList(filter);
    }
}

@JsonController('/epidemic/area-daily')
export class EpidemicAreaDailyController {
    service = new BaseService(EpidemicAreaDaily, [
        'continentName',
        'continentEnglishName',
        'countryName',
        'countryEnglishName',
        'provinceName',
        'provinceEnglishName',
        'cityName',
        'cityEnglishName'
    ]);

    @Post()
    @Authorized(UserRole.Admin)
    @ResponseSchema(EpidemicAreaDaily)
    createOne(@Body() data: EpidemicAreaDaily) {
        return this.service.createOne(data);
    }

    @Get('/:id')
    @ResponseSchema(EpidemicAreaDaily)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Get()
    @ResponseSchema(AreaDailyListChunk)
    getList(@QueryParams() filter: BaseFilter) {
        return this.service.getList(filter);
    }
}

@JsonController('/epidemic/overall')
export class EpidemicOverallController {
    service = new BaseService(EpidemicOverall, [
        'summary',
        'abroadRemark',
        'countRemark',
        'generalRemark',
        'note1',
        'note2',
        'note3',
        'remark1',
        'remark2',
        'remark3',
        'remark4',
        'remark5'
    ]);

    @Post()
    @Authorized(UserRole.Admin)
    @ResponseSchema(EpidemicOverall)
    createOne(@Body() data: EpidemicOverall) {
        return this.service.createOne(data);
    }

    @Get('/:id')
    @ResponseSchema(EpidemicOverall)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Get()
    @ResponseSchema(OverallListChunk)
    getList(@QueryParams() filter: BaseFilter) {
        return this.service.getList(filter);
    }
}

@JsonController('/epidemic/area')
export class EpidemicAreaController {
    dailyStore = dataSource.getRepository(EpidemicAreaDaily);
    countryMonthlyStore = dataSource.getRepository(EpidemicCountryMonthly);
    provinceMonthlyStore = dataSource.getRepository(EpidemicProvinceMonthly);
    cityMonthlyStore = dataSource.getRepository(EpidemicCityMonthly);

    private isMonthFormat(updateTime?: string): boolean {
        return !!updateTime && /^\d{4}-\d{2}$/.test(updateTime);
    }

    private isDayFormat(updateTime?: string): boolean {
        return !!updateTime && /^\d{4}-\d{2}-\d{2}$/.test(updateTime);
    }

    @Get()
    async getList(@QueryParams() filter: EpidemicAreaFilter) {
        const { cityName, provinceName, countryName } = filter;

        // Determine which level of data to return based on region filters
        if (cityName) {
            return this.getCityData(filter);
        } else if (provinceName) {
            return this.getProvinceData(filter);
        } else if (countryName) {
            return this.getCountryData(filter);
        } else {
            // Default to country level if no specific region is specified
            return this.getCountryData(filter);
        }
    }

    private async getCountryData(filter: EpidemicAreaFilter) {
        const { updateTime, continentName, countryName, pageSize = 10, pageIndex = 1 } = filter;

        if (this.isMonthFormat(updateTime)) {
            // Monthly data
            const where: FindOptionsWhere<EpidemicCountryMonthly> = {};
            if (updateTime) where.month = updateTime;
            if (continentName) where.continentName = continentName;
            if (countryName) where.countryName = countryName;

            const [list, count] = await this.countryMonthlyStore.findAndCount({
                where,
                skip: pageSize * (pageIndex - 1),
                take: pageSize
            });
            return { list, count };
        } else {
            // Daily data
            const where: FindOptionsWhere<EpidemicAreaDaily> = {};
            if (updateTime) where.updateTime = updateTime;
            if (continentName) where.continentName = continentName;
            if (countryName) {
                where.countryName = countryName;
            } else {
                where.countryName = Not(IsNull());
            }
            where.provinceName = IsNull();
            where.cityName = IsNull();

            const [list, count] = await this.dailyStore.findAndCount({
                where,
                skip: pageSize * (pageIndex - 1),
                take: pageSize
            });
            return { list, count };
        }
    }

    private async getProvinceData(filter: EpidemicAreaFilter) {
        const {
            updateTime,
            continentName,
            countryName,
            provinceName,
            pageSize = 10,
            pageIndex = 1
        } = filter;

        if (this.isMonthFormat(updateTime)) {
            // Monthly data
            const where: FindOptionsWhere<EpidemicProvinceMonthly> = {};
            if (updateTime) where.month = updateTime;
            if (continentName) where.continentName = continentName;
            if (countryName) where.countryName = countryName;
            if (provinceName) where.provinceName = provinceName;

            const [list, count] = await this.provinceMonthlyStore.findAndCount({
                where,
                skip: pageSize * (pageIndex - 1),
                take: pageSize
            });
            return { list, count };
        } else {
            // Daily data
            const where: FindOptionsWhere<EpidemicAreaDaily> = {};
            if (updateTime) where.updateTime = updateTime;
            if (continentName) where.continentName = continentName;
            if (countryName) where.countryName = countryName;
            if (provinceName) {
                where.provinceName = provinceName;
            } else {
                where.provinceName = Not(IsNull());
            }
            where.cityName = IsNull();

            const [list, count] = await this.dailyStore.findAndCount({
                where,
                skip: pageSize * (pageIndex - 1),
                take: pageSize
            });
            return { list, count };
        }
    }

    private async getCityData(filter: EpidemicAreaFilter) {
        const {
            updateTime,
            continentName,
            countryName,
            provinceName,
            cityName,
            pageSize = 10,
            pageIndex = 1
        } = filter;

        if (this.isMonthFormat(updateTime)) {
            // Monthly data
            const where: FindOptionsWhere<EpidemicCityMonthly> = {};
            if (updateTime) where.month = updateTime;
            if (continentName) where.continentName = continentName;
            if (countryName) where.countryName = countryName;
            if (provinceName) where.provinceName = provinceName;
            if (cityName) where.cityName = cityName;

            const [list, count] = await this.cityMonthlyStore.findAndCount({
                where,
                skip: pageSize * (pageIndex - 1),
                take: pageSize
            });
            return { list, count };
        } else {
            // Daily data
            const where: FindOptionsWhere<EpidemicAreaDaily> = {};
            if (updateTime) where.updateTime = updateTime;
            if (continentName) where.continentName = continentName;
            if (countryName) where.countryName = countryName;
            if (provinceName) where.provinceName = provinceName;
            if (cityName) {
                where.cityName = cityName;
            } else {
                where.cityName = Not(IsNull());
            }

            const [list, count] = await this.dailyStore.findAndCount({
                where,
                skip: pageSize * (pageIndex - 1),
                take: pageSize
            });
            return { list, count };
        }
    }
}

@JsonController('/epidemic/area-monthly')
export class EpidemicAreaMonthlyController {
    countryMonthlyStore = dataSource.getRepository(EpidemicCountryMonthly);
    provinceMonthlyStore = dataSource.getRepository(EpidemicProvinceMonthly);
    cityMonthlyStore = dataSource.getRepository(EpidemicCityMonthly);

    @Get('/country')
    @ResponseSchema(EpidemicCountryMonthlyListChunk)
    async getCountryList(@QueryParams() { pageSize, pageIndex }: BaseFilter) {
        const [list, count] = await this.countryMonthlyStore.findAndCount({
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }

    @Get('/province')
    @ResponseSchema(EpidemicProvinceMonthlyListChunk)
    async getProvinceList(@QueryParams() { superior, pageSize, pageIndex }: EpidemicMonthlyFilter) {
        const [list, count] = await this.provinceMonthlyStore.findAndCount({
            where: { countryName: superior },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }

    @Get('/city')
    @ResponseSchema(EpidemicCityMonthlyListChunk)
    async getCityList(@QueryParams() { superior, pageSize, pageIndex }: EpidemicMonthlyFilter) {
        const [list, count] = await this.cityMonthlyStore.findAndCount({
            where: { provinceName: superior },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}

export const epidemicControllers = [
    EpidemicNewsController,
    EpidemicRumorController,
    EpidemicAreaDailyController,
    EpidemicAreaController,
    EpidemicAreaMonthlyController,
    EpidemicOverallController
];
