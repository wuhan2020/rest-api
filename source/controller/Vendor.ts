import { Object as LCObject, Query, ACL, GeoPoint } from 'leanengine';
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
import { VendorModel } from '../model';
import { RoleController } from './Role';

export class Vendor extends LCObject {}

@JsonController('/vendor')
export class VendorController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { name, coords, ...rest }: VendorModel
    ) {
        let vendor = await new Query(Vendor).equalTo('name', name).first();

        if (vendor)
            throw new ForbiddenError(
                '同一供应商不能重复发布，请联系原发布者修改'
            );

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        vendor = await new Vendor()
            .setACL(acl)
            .save(
                { ...rest, name, coords: new GeoPoint(coords), creator: user },
                { user }
            );

        return vendor.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(Vendor, {
            include: ['creator'],
            size,
            index
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const vendor = await new Query(Vendor).get(id);

        return vendor.toJSON();
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { name, coords, ...rest }: VendorModel
    ) {
        let vendor = LCObject.createWithoutData('Vendor', id);

        await vendor.save({ ...rest, coords: new GeoPoint(coords) }, { user });

        vendor = await new Query(Vendor).include('creator').get(id);

        return vendor.toJSON();
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string
    ) {
        await LCObject.createWithoutData('Vendor', id).destroy({ user });
    }
}
