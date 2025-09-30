import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';
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
    OnNull
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import { APP_SECRET, searchConditionOf } from '../utility';
import {
    dataSource,
    User,
    UserRole,
    UserFilter,
    UserListChunk,
    EmailSignInData,
    PhoneSignInData,
    JWTAction
} from '../model';
import { activityLogService } from '../service/ActivityLog';

const userStore = dataSource.getRepository(User);

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

    static async signUp(data: EmailSignInData | PhoneSignInData) {
        const sum = await userStore.count();

        const { password: _, ...user } = await userStore.save({
            name: 'email' in data ? data.email : data.mobilePhone,
            ...data,
            password: UserController.encrypt(data.password),
            roles: [sum ? UserRole.Client : UserRole.Admin]
        });
        await activityLogService.logCreate(user, 'User', user.id);

        return user;
    }

    static getSession = ({ context: { state } }: JWTAction) =>
        'user' in state ? state.user : (console.error(state.jwtOriginalError), null);

    @Post()
    @HttpCode(201)
    @ResponseSchema(User)
    signUp(@Body() data: PhoneSignInData) {
        return UserController.signUp(data);
    }

    @Get()
    // @Authorized(UserRole.Admin)
    @ResponseSchema(UserListChunk)
    async getList(@QueryParams() { gender, keywords, pageSize, pageIndex }: UserFilter) {
        const where = searchConditionOf<User>(
            ['email', 'mobilePhone', 'name'],
            keywords,
            gender && { gender }
        );
        const [list, count] = await userStore.findAndCount({
            where,
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }

    @Get('/:id')
    @ResponseSchema(User)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return userStore.findOneBy({ id });
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(User)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() updatedBy: User,
        @Body() { password, ...data }: User
    ) {
        if (!updatedBy.roles.includes(UserRole.Admin) && id !== updatedBy.id)
            throw new ForbiddenError();

        const saved = await userStore.save({
            ...data,
            password: password && UserController.encrypt(password),
            id
        });
        await activityLogService.logUpdate(updatedBy, 'User', id);

        return UserController.sign(saved);
    }
}
