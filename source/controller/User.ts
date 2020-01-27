import {
    JsonController,
    Get,
    Authorized,
    Ctx,
    QueryParam,
    ForbiddenError,
    Param,
    Post,
    OnUndefined,
    Delete
} from 'routing-controllers';
import { User, Query, Object as LCObject, Role } from 'leanengine';

import { LCContext } from '../utility';
import { RoleController } from './Role';

@JsonController('/user')
export class UserController {
    static async getUserWithRoles(user: User | string) {
        if (typeof user === 'string') user = await new Query(User).get(user);

        const roles = (await user.getRoles()).map(role => role.getName());

        return { ...user.toJSON(), roles };
    }

    @Get()
    @Authorized()
    async getList(
        @Ctx() { currentUser }: LCContext,
        @QueryParam('phone') phone: string,
        @QueryParam('pageSize') size = 10,
        @QueryParam('pageIndex') index = 1
    ) {
        if (!(await RoleController.isAdmin(currentUser)))
            throw new ForbiddenError();

        const query = new Query(User);

        if (phone) query.equalTo('mobilePhoneNumber', phone);

        const count = await query.count({ useMasterKey: true });

        query.skip(size * --index).limit(size);

        const list = await query.find({ useMasterKey: true }),
            data = [];

        for (const user of list)
            data.push(await UserController.getUserWithRoles(user));

        return { data, count };
    }

    @Get('/:id')
    getOne(@Param('id') id: string) {
        return UserController.getUserWithRoles(id);
    }

    @Post('/:id/role/:rid')
    @OnUndefined(201)
    async addRole(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Param('rid') rid: string
    ) {
        const role = await new Query(Role).get(rid);

        role.getUsers().add(LCObject.createWithoutData('_User', id));

        await role.save(null, { user: currentUser });
    }

    @Delete('/:id/role/:rid')
    @OnUndefined(204)
    async removeRole(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Param('rid') rid: string
    ) {
        const role = await new Query(Role).get(rid);

        role.getUsers().remove(LCObject.createWithoutData('_User', id));

        await role.save(null, { user: currentUser });
    }
}
