import { Context } from 'koa';
import { FindOptionsWhere, ILike, Repository, FindManyOptions, FindOptionsOrder } from 'typeorm';
import jwt from 'jsonwebtoken';
import { User } from './model/User';
import { APP_SECRET } from './model/DataSource';

interface JWTPayload {
    id: number;
    name: string;
    roles: string[];
}

export interface AuthenticatedContext extends Context {
    state: {
        user?: User;
        jwtdata?: JWTPayload;
    };
}

interface PageQuery<T> {
    size?: number;
    index?: number;
    equal?: FindOptionsWhere<T>;
    where?: FindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
    relations?: string[];
}

export interface PageResult<T> {
    data: T[];
    count: number;
}

export async function queryPage<T>(
    repository: Repository<T>,
    {
        size = 10,
        index = 1,
        equal,
        where,
        order,
        relations = [],
    }: PageQuery<T>,
): Promise<PageResult<T>> {
    const skip = size * (index - 1);

    const queryOptions: FindManyOptions<T> = {
        skip,
        take: size,
        where: where || equal,
        relations,
    };

    if (order) {
        queryOptions.order = order;
    }

    const [data, count] = await repository.findAndCount(queryOptions);

    return { data, count };
}

export function searchConditionOf<T>(
    keys: (keyof T)[],
    keywords = '',
    filter?: FindOptionsWhere<T>,
) {
    return keywords
        ? keys.map((key) => ({ [key]: ILike(`%${keywords}%`), ...filter }))
        : filter;
}

export function generateToken(user: User): string {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            roles: user.roles,
        },
        APP_SECRET,
        { expiresIn: '7d' },
    );
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, APP_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}
