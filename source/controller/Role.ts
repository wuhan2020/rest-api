import {
    JsonController,
    Authorized,
    Post,
    Ctx,
    Body,
    ForbiddenError,
    Get
} from 'routing-controllers';
import { Query, Role, User, ACL } from 'leanengine';

import { LCContext } from '../utility';
import { UserRole } from '../model';

@JsonController('/role')
export class RoleController {
    static getAdmin() {
        return new Query(Role).equalTo('name', UserRole.Admin).first();
    }

    static async create(name: string, user: User) {
        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true);

        const admin = await this.getAdmin();

        if (admin) acl.setRoleWriteAccess(admin, true);

        const role = new Role(name, acl);

        role.getUsers().add(user);

        return role.save();
    }

    static async isAdmin(user: User) {
        const list = await user.getRoles();

        return !!list.find(role => role.getName() === UserRole.Admin);
    }

    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() { name }: { name: string }
    ) {
        if (!(await RoleController.isAdmin(currentUser)))
            throw new ForbiddenError();

        const role = await RoleController.create(name, currentUser);

        return role.toJSON();
    }

    @Get()
    @Authorized()
    async getAll(@Ctx() { currentUser }: LCContext) {
        if (!(await RoleController.isAdmin(currentUser)))
            throw new ForbiddenError();

        const list = await new Query(Role).find();

        return list.map(item => item.toJSON());
    }
}
