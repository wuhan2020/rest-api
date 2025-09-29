import { ForbiddenError, NotFoundError } from 'routing-controllers';
import { DeepPartial, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { Constructor } from 'web-utility';

import { searchConditionOf } from '../utility';
import {
    dataSource,
    User,
    UserRole,
    ActivityLog,
    VerificationBase,
    VerificationBaseFilter,
    ListChunk,
} from '../model';
import { activityLogService } from './ActivityLog';

export class VerificationService<T extends VerificationBase> {
    store: Repository<T>;
    logName: ActivityLog['tableName'];

    constructor(
        public entityClass: Constructor<T>,
        public searchKeys: (keyof T)[],
    ) {
        this.store = dataSource.getRepository(entityClass);
        this.logName = entityClass.name as ActivityLog['tableName'];
    }

    async createOne(data: T, createdBy: User) {
        const createdOne = await this.store.save({ ...data, createdBy, verified: false });

        await activityLogService.logCreate(createdBy, this.logName, createdOne.id);

        return createdOne;
    }

    getOne(id: number) {
        return this.store.findOne({
            where: { id } as FindOptionsWhere<T>,
            relations: ['createdBy', 'verifiedBy'],
        });
    }

    async editOne(id: number, { verifiedAt, verifiedBy, ...data }: Partial<T>, updatedBy: User) {
        const { store, logName } = this;

        const oldOne = await this.getOne(id);

        if (!oldOne) throw new NotFoundError(`${logName} ${id} is not found`);

        const isCreator = oldOne.createdBy?.id === updatedBy.id;

        if (
            !isCreator &&
            !updatedBy.roles.includes(UserRole.Admin) &&
            !updatedBy.roles.includes(UserRole.Worker)
        )
            throw new ForbiddenError(`Only creator or staff can edit ${logName} ${id}`);

        const updatedOne = await store.save({
            ...data,
            id,
            verifiedAt: isCreator ? null : new Date() + '',
            verifiedBy: isCreator ? null : verifiedBy,
        } as T);

        await activityLogService.logUpdate(updatedBy, logName, id);

        return updatedOne;
    }

    async verifyOne(id: number, verifiedBy: User) {
        const { store, logName } = this;

        const existed = await store.existsBy({ id } as FindOptionsWhere<T>);

        if (!existed) throw new NotFoundError(`${logName} ${id} is not found`);

        const updatedOne = await store.save({
            id,
            verifiedAt: new Date() + '',
            verifiedBy,
        } as DeepPartial<T>);

        await activityLogService.logUpdate(verifiedBy, logName, id);

        return updatedOne;
    }

    async deleteOne(id: number, deletedBy: User) {
        const { store, logName } = this;

        const oldOne = await store.findOne({
            where: { id } as FindOptionsWhere<T>,
            relations: ['createdBy'],
        });

        if (!oldOne) throw new NotFoundError(`${logName} ${id} is not found`);

        if (oldOne.createdBy?.id !== deletedBy.id && !deletedBy.roles.includes(UserRole.Admin))
            throw new ForbiddenError(`Only creator or admin can delete ${logName} ${id}`);

        await store.softDelete(id);
        await activityLogService.logDelete(deletedBy, logName, id);
    }

    async getList({ verified, keywords, pageSize, pageIndex }: VerificationBaseFilter) {
        const where = searchConditionOf<T>(this.searchKeys, keywords, {
            verifiedAt: verified ? Not(IsNull()) : verified === false ? IsNull() : undefined,
        } as FindOptionsWhere<T>);

        const [list, count] = await this.store.findAndCount({
            relations: ['createdBy', 'verifiedBy'],
            where,
            skip: pageSize * (pageIndex - 1),
            take: pageSize,
        });
        return { list, count } as ListChunk<T>;
    }
}
