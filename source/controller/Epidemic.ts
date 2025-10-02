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
    dataSource,
    EpidemicAreaDaily,
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
    EpidemicAreaMonthlyController,
    EpidemicOverallController
];
