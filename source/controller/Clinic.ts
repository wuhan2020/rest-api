import { Object as LCObject, Query, ACL, stringify } from 'leanengine';
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
    Delete,
    OnUndefined
} from 'routing-controllers';

import { LCContext, queryPage } from '../utility';
import { ClinicModel } from '../model';
import { RoleController } from './Role';

export class Clinic extends LCObject {}

@JsonController('/clinic')
export class ClinicController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { name, startTime, endTime, ...rest }: ClinicModel
    ) {
        let clinic = await new Query(Clinic).equalTo('name', name).first();

        if (clinic)
            throw new ForbiddenError(
                '同一义诊机构/个人不能重复发布，请联系原发布者修改'
            );

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        clinic = await new Clinic().setACL(acl).save(
            {
                ...rest,
                name,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                creator: user
            },
            { user }
        );

        return clinic.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(Clinic, {
            include: ['creator'],
            size,
            index
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const clinic = await new Query(Clinic).get(id);

        return clinic.toJSON();
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { name, startTime, endTime, ...rest }: ClinicModel
    ) {
        let clinic = LCObject.createWithoutData('Clinic', id);

        await clinic.save(
            {
                ...rest,
                startTime: new Date(startTime),
                endTime: new Date(endTime)
            },
            { user }
        );

        clinic = await new Query(Clinic).include('creator').get(id);

        return clinic.toJSON();
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string
    ) {
        await LCObject.createWithoutData('Clinic', id).destroy({ user });
    }
}
