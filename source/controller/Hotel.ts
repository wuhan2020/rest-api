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
    Patch,
    OnUndefined,
    Delete
} from 'routing-controllers';

import { LCContext, queryPage } from '../utility';
import { HotelModel } from '../model';
import { RoleController } from './Role';

export class Hotel extends LCObject {}

@JsonController('/hotel')
export class HotelController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser: user }: LCContext,
        @Body() { name, coords, ...rest }: HotelModel
    ) {
        let hotel = await new Query(Hotel).equalTo('name', name).first();

        if (hotel)
            throw new ForbiddenError(
                '同一宾馆不能重复发布，请联系原发布者修改'
            );

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await RoleController.getAdmin(), true);

        hotel = await new Hotel().setACL(acl).save(
            {
                ...rest,
                name,
                coords: new GeoPoint(coords),
                creator: user,
                verified: false
            },
            { user }
        );

        return hotel.toJSON();
    }

    @Get()
    getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('province') province: string,
        @QueryParam('city') city: string,
        @QueryParam('district') district: string,
        @QueryParam('name') name: string,
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(Hotel, {
            include: ['creator', 'verifier'],
            equal: { verified, province, city, district },
            contains: { name },
            size,
            index
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const hotel = await new Query(Hotel).get(id);

        return hotel.toJSON();
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string,
        @Body() { name, coords, ...rest }: HotelModel
    ) {
        let hotel = LCObject.createWithoutData('Hotel', id);

        await hotel.save(
            {
                ...rest,
                coords: new GeoPoint(coords),
                verified: false,
                verifier: null
            },
            { user }
        );

        hotel = await new Query(Hotel).include('creator').get(id);

        return hotel.toJSON();
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

        await LCObject.createWithoutData('Hotel', id).save(
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
        await LCObject.createWithoutData('Hotel', id).destroy({ user });
    }
}
