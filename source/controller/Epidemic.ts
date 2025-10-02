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

import {
    AreaDailyListChunk,
    BaseFilter,
    CityMonthlyStats,
    CityMonthlyStatsListChunk,
    CountryMonthlyStats,
    CountryMonthlyStatsListChunk,
    dataSource,
    EpidemicAreaDaily,
    EpidemicNews,
    EpidemicOverall,
    EpidemicRumor,
    NewsListChunk,
    OverallListChunk,
    ProvinceMonthlyStats,
    ProvinceMonthlyStatsListChunk,
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

@JsonController('/epidemic/monthly-stats/country')
export class CountryMonthlyStatsController {
    store = dataSource.getRepository(CountryMonthlyStats);

    @Get()
    @ResponseSchema(CountryMonthlyStatsListChunk)
    async getList(@QueryParams() { pageSize, pageIndex }: BaseFilter) {
        const [list, count] = await this.store.findAndCount({
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}

@JsonController('/epidemic/monthly-stats/province')
export class ProvinceMonthlyStatsController {
    store = dataSource.getRepository(ProvinceMonthlyStats);

    @Get()
    @ResponseSchema(ProvinceMonthlyStatsListChunk)
    async getList(@QueryParams() { pageSize, pageIndex }: BaseFilter) {
        const [list, count] = await this.store.findAndCount({
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}

@JsonController('/epidemic/monthly-stats/city')
export class CityMonthlyStatsController {
    store = dataSource.getRepository(CityMonthlyStats);

    @Get()
    @ResponseSchema(CityMonthlyStatsListChunk)
    async getList(@QueryParams() { pageSize, pageIndex }: BaseFilter) {
        const [list, count] = await this.store.findAndCount({
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
    EpidemicOverallController,
    CountryMonthlyStatsController,
    ProvinceMonthlyStatsController,
    CityMonthlyStatsController
];
