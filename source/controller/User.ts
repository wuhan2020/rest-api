import {
    JsonController,
    Get,
    Authorized,
    CurrentUser,
    QueryParams,
    ForbiddenError,
    Param,
    Post,
    Put,
    Body,
    HttpCode,
    OnNull,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { searchConditionOf } from '../utility';
import { User, UserRole, UserFilter, UserListChunk, PhoneSignInData } from '../model';
import { activityLogService } from '../service';
import { sessionService } from '../service';

@JsonController('/user')
export class UserController {
    store = sessionService.userStore;

    @Post()
    @HttpCode(201)
    @ResponseSchema(User)
    signUp(@Body() data: PhoneSignInData) {
        return sessionService.signUp(data);
    }

    @Get()
    // @Authorized(UserRole.Admin)
    @ResponseSchema(UserListChunk)
    async getList(@QueryParams() { gender, keywords, pageSize, pageIndex }: UserFilter) {
        const where = searchConditionOf<User>(
            ['email', 'mobilePhone', 'name'],
            keywords,
            gender && { gender },
        );
        const [list, count] = await this.store.findAndCount({
            where,
            skip: pageSize * (pageIndex - 1),
            take: pageSize,
        });
        return { list, count };
    }

    @Get('/:id')
    @ResponseSchema(User)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return this.store.findOneBy({ id });
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(User)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() updatedBy: User,
        @Body() { password, ...data }: User,
    ) {
        if (!updatedBy.roles.includes(UserRole.Admin) && id !== updatedBy.id)
            throw new ForbiddenError();

        const saved = await this.store.save({
            ...data,
            password: password && sessionService.encrypt(password),
            id,
        });
        await activityLogService.logUpdate(updatedBy, 'User', id);

        return sessionService.sign(saved);
    }
}
