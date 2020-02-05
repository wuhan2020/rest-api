import { Object as LCObject, Query, ACL } from 'leanengine';
import {
    JsonController,
    Post,
    Authorized,
    Ctx,
    Body,
    ForbiddenError,
    Get,
    QueryParam,
    Param,
    Put,
    Patch,
    OnUndefined,
    Delete
} from 'routing-controllers';

import { LCContext, queryPage } from '../utility';
import { DonationRecipientModel } from '../model';
import { RoleController } from './Role';

export class DonationRecipient extends LCObject {}

@JsonController('/donation/recipient')
export class DonationRecipientController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { name, ...rest }: DonationRecipientModel
    ) {
        let donationRecipient = await new Query(DonationRecipient)
            .equalTo('name', name)
            .first();

        if (donationRecipient)
            throw new ForbiddenError(
                '同一捐款接收方不能重复发布，请联系原发布者修改'
            );

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        donationRecipient = await new DonationRecipient()
            .setACL(acl)
            .save({ ...rest, name, creator: user, verified: false }, { user });

        return donationRecipient.toJSON();
    }

    @Get()
    getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(DonationRecipient, {
            include: ['creator', 'verifier'],
            equal: { verified },
            size,
            index
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const donationRecipient = await new Query(DonationRecipient).get(id);

        return donationRecipient.toJSON();
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { name, ...rest }: DonationRecipientModel
    ) {
        let donationRecipient = LCObject.createWithoutData(
            'DonationRecipient',
            id
        );
        await donationRecipient.save(
            { ...rest, verified: false, verifier: null },
            { user }
        );

        donationRecipient = await new Query(DonationRecipient)
            .include('creator')
            .get(id);

        return donationRecipient.toJSON();
    }

    @Patch('/:id')
    @Authorized()
    @OnUndefined(204)
    async verify(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { verified }: { verified: boolean }
    ) {
        if (!(await RoleController.isAdmin(user))) throw new ForbiddenError();

        await LCObject.createWithoutData('DonationRecipient', id).save(
            { verified, verifier: user },
            { user }
        );
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string
    ) {
        await LCObject.createWithoutData('DonationRecipient', id).destroy({
            user
        });
    }
}
