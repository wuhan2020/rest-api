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
    DonationRecipient,
    DonationRecipientListChunk,
} from '../model';
import { VerificationService } from '../service/User';

@JsonController('/donation/recipient')
export class DonationRecipientController {
    service = new VerificationService(DonationRecipient, ['name', 'remark']);

    @Post()
    @Authorized()
    create(@CurrentUser() createdBy: User, @Body() data: DonationRecipient) {
        return this.service.createOne(data, createdBy);
    }

    @Get()
    @ResponseSchema(DonationRecipientListChunk)
    getList(@QueryParams() filter: VerificationBaseFilter) {
        return this.service.getList(filter);
    }

    @Get('/:id')
    @ResponseSchema(DonationRecipient)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.service.getOne(id);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(DonationRecipient)
    edit(
        @CurrentUser() updatedBy: User,
        @Param('id') id: number,
        @Body() clinic: DonationRecipient,
    ) {
        return this.service.editOne(id, clinic, updatedBy);
    }

    @Patch('/:id/verification')
    @Authorized([UserRole.Admin, UserRole.Worker])
    @ResponseSchema(DonationRecipient)
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
