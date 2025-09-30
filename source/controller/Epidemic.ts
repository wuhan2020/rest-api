import {
    JsonController,
    Get,
    Post,
    Param,
    QueryParams,
    Authorized,
    Body
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import {
    BaseFilter,
    UserRole,
    EpidemicNews,
    NewsListChunk,
    EpidemicRumor,
    RumorListChunk,
    EpidemicAreaDaily,
    AreaDailyListChunk,
    EpidemicOverall,
    OverallListChunk
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

export const epidemicControllers = [
    EpidemicNewsController,
    EpidemicRumorController,
    EpidemicAreaDailyController,
    EpidemicOverallController
];
