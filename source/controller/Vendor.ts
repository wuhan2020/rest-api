import {
    JsonController,
    Post,
    Authorized,
    Body,
    Get,
    QueryParams,
    Param,
    Put,
    Patch,
    OnUndefined,
    Delete,
    CurrentUser,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { OnNull } from 'routing-controllers';

import { User, UserRole, VerificationBaseFilter, Vendor, VendorListChunk } from '../model';
import { VerificationService } from '../service/User';

@JsonController('/vendor')
export class VendorController {
    service = new VerificationService(Vendor, ['name', 'remark']);

    @Post()
    @Authorized()
    @ResponseSchema(Vendor)
    async create(@CurrentUser() createdBy: User, @Body() vendor: Vendor) {
        return this.service.createOne(vendor, createdBy);
    }

    @Get()
    @ResponseSchema(VendorListChunk)
    getList(@QueryParams() filter: VerificationBaseFilter) {
        return this.service.getList(filter);
    }

    @Get('/:id')
    @ResponseSchema(Vendor)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(Vendor)
    edit(@CurrentUser() updatedBy: User, @Param('id') id: number, @Body() vendor: Vendor) {
        return this.service.editOne(id, vendor, updatedBy);
    }

    @Patch('/:id/verification')
    @Authorized([UserRole.Admin, UserRole.Worker])
    @ResponseSchema(Vendor)
    verify(@CurrentUser() verifiedBy: User, @Param('id') id: number) {
        return this.service.verifyOne(id, verifiedBy);
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    delete(@CurrentUser() deletedBy: User, @Param('id') id: number) {
        return this.service.deleteOne(id, deletedBy);
    }
}
