import {
    JsonController,
    Post,
    Authorized,
    CurrentUser,
    Body,
    Get,
    QueryParams,
    Param,
    Put,
    Patch,
    Delete,
    OnUndefined,
    OnNull,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { User, UserRole, VerificationBaseFilter, Logistics, LogisticsListChunk } from '../model';
import { VerificationService } from '../service';

@JsonController('/logistics')
export class LogisticsController {
    service = new VerificationService(Logistics, ['name', 'remark']);

    @Post()
    @Authorized()
    create(@CurrentUser() createdBy: User, @Body() data: Logistics) {
        return this.service.createOne(data, createdBy);
    }

    @Get()
    @ResponseSchema(LogisticsListChunk)
    getList(@QueryParams() filter: VerificationBaseFilter) {
        return this.service.getList(filter);
    }

    @Get('/:id')
    @ResponseSchema(Logistics)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(Logistics)
    edit(@CurrentUser() updatedBy: User, @Param('id') id: number, @Body() logistics: Logistics) {
        return this.service.editOne(id, logistics, updatedBy);
    }

    @Patch('/:id/verification')
    @Authorized([UserRole.Admin, UserRole.Worker])
    @ResponseSchema(Logistics)
    verify(@CurrentUser() verifiedBy: User, @Param('id') id: number) {
        return this.service.verifyOne(id, verifiedBy);
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    deleteOne(@Param('id') id: number, @CurrentUser() deletedBy: User) {
        return this.service.deleteOne(id, deletedBy);
    }
}
