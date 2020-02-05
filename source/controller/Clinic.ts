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
import { ClinicModel } from '../model';
import { RoleController } from './Role';

export class Clinic extends LCObject {}

@JsonController('/clinic')
export class ClinicController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { name, ...rest }: ClinicModel
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

        clinic = await new Clinic()
            .setACL(acl)
            .save({ ...rest, name, creator: user, verified: false }, { user });

        return clinic.toJSON();
    }

    @Get()
    getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(Clinic, {
            include: ['creator', 'verifier'],
            equal: { verified },
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
        @Body() { name, ...rest }: ClinicModel
    ) {
        let clinic = LCObject.createWithoutData('Clinic', id);

        await clinic.save(
            { ...rest, verified: false, verifier: null },
            { user }
        );

        clinic = await new Query(Clinic).include('creator').get(id);

        return clinic.toJSON();
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

        await LCObject.createWithoutData('Clinic', id).save(
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
        await LCObject.createWithoutData('Clinic', id).destroy({ user });
    }
}
