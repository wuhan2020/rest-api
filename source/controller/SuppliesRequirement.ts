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
    Put,
    Param,
    Delete,
    OnUndefined
} from 'routing-controllers';

import { LCContext, queryPage } from '../utility';
import { RequirementModel } from '../model/Supplies';
import { RoleController } from './Role';

export class SuppliesRequirement extends LCObject {}

@JsonController('/supplies/requirement')
export class RequirementController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { hospital, ...rest }: RequirementModel
    ) {
        let requirement = await new Query(SuppliesRequirement)
            .equalTo('hospital', hospital)
            .first();

        if (requirement) throw new ForbiddenError();

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        requirement = await new SuppliesRequirement().save(
            { ...rest, hospital, creator: user },
            { user }
        );

        return requirement.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(SuppliesRequirement, { size, index });
    }

    @Put('/:id')
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { hospital, address, ...rest }: RequirementModel
    ) {
        const requirement = LCObject.createWithoutData(
            'SuppliesRequirement',
            id
        );

        await requirement.save(rest, { user });

        return requirement.toJSON();
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string
    ) {
        await LCObject.createWithoutData('SuppliesRequirement', id).destroy({
            user
        });
    }
}
