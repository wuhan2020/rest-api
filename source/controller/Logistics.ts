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
import { LogisticsModel } from '../model';
import { RoleController } from './Role';

export class Logistics extends LCObject {}

@JsonController('/logistics')
export class LogisticsController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { name, ...rest }: LogisticsModel
    ) {
        let logistics = await new Query(Logistics)
            .equalTo('name', name)
            .first();

        if (logistics)
            throw new ForbiddenError(
                '同一物流公司不能重复发布，请联系原发布者修改'
            );

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        logistics = await new Logistics()
            .setACL(acl)
            .save({ ...rest, name, creator: user, verified: false }, { user });

        return logistics.toJSON();
    }

    @Get()
    getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(Logistics, {
            include: ['creator', 'verifier'],
            equal: { verified },
            size,
            index
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const logistics = await new Query(Logistics).get(id);

        return logistics.toJSON();
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { name, ...rest }: LogisticsModel
    ) {
        let logistics = LCObject.createWithoutData('Logistics', id);

        await logistics.save(
            { ...rest, verified: false, verifier: null },
            { user }
        );

        logistics = await new Query(Logistics).include('creator').get(id);

        return logistics.toJSON();
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

        await LCObject.createWithoutData('Logistics', id).save(
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
        await LCObject.createWithoutData('Logistics', id).destroy({
            user
        });
    }
}
