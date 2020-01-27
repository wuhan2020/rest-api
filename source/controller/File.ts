import {
    JsonController,
    Post,
    Authorized,
    Ctx,
    UploadedFile,
    Get,
    QueryParam,
    Delete,
    Param,
    OnUndefined
} from 'routing-controllers';
import { File } from 'koa-multer';
import { File as LCFile, ACL, Object as LCObject } from 'leanengine';

import { LCContext, queryPage } from '../utility';
import { RoleController } from './Role';

@JsonController('/file')
export class FileController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { currentUser }: LCContext,
        @UploadedFile('file') { buffer, originalname }: File
    ) {
        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(currentUser, true);

        const admin = await RoleController.getAdmin();

        if (admin) acl.setRoleWriteAccess(admin, true);

        const file = await new LCFile(originalname, buffer).setACL(acl).save();

        return file.toJSON();
    }

    @Get()
    @Authorized()
    getList(
        @QueryParam('pageSize') size: number,
        @QueryParam('pageIndex') index: number
    ) {
        return queryPage(LCFile, { size, index });
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { currentUser: user }: LCContext,
        @Param('id') id: string
    ) {
        await LCObject.createWithoutData('_File', id).destroy({ user });
    }
}
