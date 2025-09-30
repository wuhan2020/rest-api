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

import {
    User,
    UserRole,
    VerificationBaseFilter,
    SuppliesRequirement,
    SuppliesRequirementListChunk,
} from '../model';
import { VerificationService } from '../service';

@JsonController('/supplies/requirement')
export class RequirementController {
    service = new VerificationService(SuppliesRequirement, ['name', 'remark']);

    @Post()
    @Authorized()
    create(@CurrentUser() createdBy: User, @Body() data: SuppliesRequirement) {
        return this.service.createOne(data, createdBy);
    }

    @Get()
    @ResponseSchema(SuppliesRequirementListChunk)
    getList(@QueryParams() filter: VerificationBaseFilter) {
        return this.service.getList(filter);
    }

    @Get('/:id')
    @ResponseSchema(SuppliesRequirement)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(SuppliesRequirement)
    edit(
        @CurrentUser() updatedBy: User,
        @Param('id') id: number,
        @Body() requirement: SuppliesRequirement,
    ) {
        return this.service.editOne(id, requirement, updatedBy);
    }

    @Patch('/:id/verification')
    @Authorized([UserRole.Admin, UserRole.Worker])
    @ResponseSchema(SuppliesRequirement)
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
