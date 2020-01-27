import { Context } from 'koa';
import { User, Query, AuthOptions, Queriable } from 'leanengine';

export interface LCUser extends User {
    logOut(): any;
}

export interface LCContext extends Context {
    saveCurrentUser(user: User): any;
    currentUser: LCUser;
    clearCurrentUser(): any;
}

interface Condition {
    [key: string]: any;
}

interface PageQuery {
    size?: number;
    index?: number;
    equal?: Condition;
    less?: Condition;
    greater?: Condition;
    ascend?: string[];
    descend?: string[];
    select?: string[];
    include?: string[];
    auth?: AuthOptions;
}

export async function queryPage<T extends Queriable>(
    model: new (...args: any[]) => T,
    {
        size = 10,
        index = 1,
        equal,
        less,
        greater,
        ascend = [],
        descend = ['updatedAt', 'createdAt'],
        select = [],
        include = [],
        auth
    }: PageQuery
) {
    const query = new Query<T>(model);

    for (const key in equal)
        if (equal[key] != null) query.equalTo(key, equal[key]);

    for (const key in less)
        if (less[key] != null) query.lessThanOrEqualTo(key, less[key]);

    for (const key in greater)
        if (greater[key] != null) query.greaterThanOrEqualTo(key, greater[key]);

    const count = await query.count(auth);

    if (!count) return { data: [], count };

    for (const key of ascend) query.addAscending(key);

    for (const key of descend) query.addDescending(key);

    query.limit(size).skip(size * --index);

    if (select[0]) query.select(...select);

    if (include[0]) query.include(...include);

    const data = (await query.find(auth)).map(item => item.toJSON());

    return { data, count };
}
