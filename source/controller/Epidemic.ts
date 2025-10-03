import {
    Authorized,
    Body,
    Get,
    JsonController,
    OnUndefined,
    Param,
    Post,
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { formatDate } from 'web-utility';

import {
    BaseFilter,
    dataSource,
    EpidemicAreaDaily,
    EpidemicAreaDailyListChunk,
    EpidemicAreaFilter,
    EpidemicCityMonthly,
    EpidemicCountryMonthly,
    EpidemicNews,
    EpidemicOverall,
    EpidemicProvinceMonthly,
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
    @ResponseSchema(EpidemicAreaDailyListChunk)
    @OnUndefined(400)
    getList(@QueryParams() { updateTime, ...filter }: EpidemicAreaFilter) {
        if (updateTime?.match(/^\d{4}-\d{2}-\d{2}$/))
            return this.service.getList({ ...filter, updateTime });
    }
}

@JsonController('/epidemic/area-monthly')
export class EpidemicAreaMonthlyController {
    countryMonthlyStore = dataSource.getRepository(EpidemicCountryMonthly);
    provinceMonthlyStore = dataSource.getRepository(EpidemicProvinceMonthly);
    cityMonthlyStore = dataSource.getRepository(EpidemicCityMonthly);

    @Get()
    @ResponseSchema(EpidemicAreaDailyListChunk)
    async getList(@QueryParams() { updateTime, ...filter }: EpidemicAreaFilter) {
        const month = updateTime && formatDate(updateTime, 'YYYY-MM');

        const { continentName, countryName, provinceName, pageSize, pageIndex } = filter;

        const store = continentName
            ? this.countryMonthlyStore
            : countryName
              ? this.provinceMonthlyStore
              : provinceName && this.cityMonthlyStore;

        if (!store) return;

        const [list, count] = await store.findAndCount({
            where: { ...filter, ...(month && { month }) },
            order: { month: 'DESC' },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
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

export const epidemicControllers = [
    EpidemicNewsController,
    EpidemicRumorController,
    EpidemicAreaDailyController,
    EpidemicAreaMonthlyController,
    EpidemicOverallController
];
