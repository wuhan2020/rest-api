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

import { User, UserRole, VerificationBaseFilter, Clinic, ClinicListChunk } from '../model';
import { VerificationService } from '../service';

@JsonController('/clinic')
export class ClinicController {
    service = new VerificationService(Clinic, ['name', 'remark']);

    @Post()
    @Authorized()
    create(@CurrentUser() createdBy: User, @Body() data: Clinic) {
        return this.service.createOne(data, createdBy);
    }

    @Get()
    @ResponseSchema(ClinicListChunk)
    getList(@QueryParams() filter: VerificationBaseFilter) {
        return this.service.getList(filter);
    }

    @Get('/:id')
    @ResponseSchema(Clinic)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(Clinic)
    edit(@CurrentUser() updatedBy: User, @Param('id') id: number, @Body() clinic: Clinic) {
        return this.service.editOne(id, clinic, updatedBy);
    }

    @Patch('/:id/verification')
    @Authorized([UserRole.Admin, UserRole.Worker])
    @ResponseSchema(Clinic)
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
