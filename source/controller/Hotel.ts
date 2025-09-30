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

import { User, UserRole, VerificationBaseFilter, Hotel, HotelListChunk } from '../model';
import { VerificationService } from '../service';

@JsonController('/hotel')
export class HotelController {
    service = new VerificationService(Hotel, ['name', 'remark']);

    @Post()
    @Authorized()
    create(@CurrentUser() createdBy: User, @Body() data: Hotel) {
        return this.service.createOne(data, createdBy);
    }

    @Get()
    @ResponseSchema(HotelListChunk)
    getList(@QueryParams() filter: VerificationBaseFilter) {
        return this.service.getList(filter);
    }

    @Get('/:id')
    @ResponseSchema(Hotel)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(Hotel)
    edit(@CurrentUser() updatedBy: User, @Param('id') id: number, @Body() hotel: Hotel) {
        return this.service.editOne(id, hotel, updatedBy);
    }

    @Patch('/:id/verification')
    @Authorized([UserRole.Admin, UserRole.Worker])
    @ResponseSchema(Hotel)
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
