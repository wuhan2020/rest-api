import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    ForbiddenError,
    Get,
    HttpCode,
    JsonController,
    OnNull,
    OnUndefined,
    Param,
    Post,
    Put,
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { 
    dataSource, 
    User, 
    UserRole, 
    UserFilter, 
    UserListChunk 
} from '../model';
import { APP_SECRET, AuthenticatedContext } from '../utility';
import { ActivityLogController } from './ActivityLog';

const store = dataSource.getRepository(User);

export interface JWTAction {
    context: AuthenticatedContext;
}

@JsonController('/user')
export class UserController {
    static encrypt = (raw: string) =>
        createHash('sha1')
            .update(APP_SECRET + raw)
            .digest('hex');

    static sign = (user: User): User => ({
        ...user,
        token: sign({ ...user }, APP_SECRET)
    });

    static getSession = ({ context }: JWTAction) => {
        const ctx = context as AuthenticatedContext;
        if (ctx.state.user) return ctx.state.user;

        if (ctx.state.jwtdata) {
            // Return the user data from JWT for @CurrentUser to work
            return ctx.state.jwtdata as User;
        }

        return null;
    };

    @Get('/:id')
    @OnNull(404)
    @ResponseSchema(User)
    getOne(@Param('id') id: number) {
        return store.findOne({ where: { id } });
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(User)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() updatedBy: User,
        @Body() { ...data }: User
    ) {
        if (
            !updatedBy.roles.includes(UserRole.Admin) &&
            id !== updatedBy.id
        )
            throw new ForbiddenError();

        const saved = await store.save({
            ...data,
            id
        });
        await ActivityLogController.logUpdate(updatedBy, 'User', id);

        return saved;
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async deleteOne(@Param('id') id: number, @CurrentUser() deletedBy: User) {
        if (deletedBy.roles.includes(UserRole.Admin) && id == deletedBy.id)
            throw new ForbiddenError();

        await store.softDelete(id);
        await ActivityLogController.logDelete(deletedBy, 'User', id);
    }

    @Get()
    @ResponseSchema(UserListChunk)
    async getList(
        @QueryParams() filter: UserFilter
    ) {
        const [list, count] = await store.findAndCount({
            take: filter.pageSize || 10,
            skip: ((filter.pageIndex || 1) - 1) * (filter.pageSize || 10)
        });
        return { list, count };
    }
}
