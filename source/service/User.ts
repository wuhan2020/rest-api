import { ForbiddenError, NotFoundError } from 'routing-controllers';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { Constructor } from 'web-utility';

import { searchConditionOf } from '../utility';
import {
    dataSource,
    User,
    UserRole,
    UserBase,
    UserBaseFilter,
    ActivityLog,
    VerificationBase,
    VerificationBaseFilter,
    ListChunk,
} from '../model';
import { activityLogService } from './ActivityLog';

export class CRUDService<T extends UserBase> {
    store: Repository<T>;
    tableName: string;

    constructor(
        public entityClass: Constructor<T>,
        public searchKeys: (keyof T)[],
    ) {
        this.store = dataSource.getRepository(entityClass);
        this.tableName = entityClass.name;
    }

    createOne(data: Partial<T>, createdBy: User) {
        return this.store.save({ ...data, createdBy } as T);
    }

    getOne(id: number, relations: string[] = ['createdBy', 'updatedBy']) {
        return this.store.findOne({ where: { id } as FindOptionsWhere<T>, relations });
    }

    async editOne(id: number, data: Partial<T>, updatedBy: User) {
        const { store, tableName } = this;

        const oldOne = await this.getOne(id);

        if (!oldOne) throw new NotFoundError(`${tableName} ${id} is not found`);

        if (
            oldOne.createdBy?.id !== updatedBy.id &&
            !updatedBy.roles.includes(UserRole.Admin) &&
            !updatedBy.roles.includes(UserRole.Worker)
        )
            throw new ForbiddenError(`Only creator or staff can edit ${tableName} ${id}`);

        return store.save({ ...data, id, updatedBy } as T);
    }

    async deleteOne(id: number, deletedBy: User) {
        const { store, tableName } = this;

        const oldOne = await store.findOne({
            where: { id } as FindOptionsWhere<T>,
            relations: ['createdBy'],
        });

        if (!oldOne) throw new NotFoundError(`${tableName} ${id} is not found`);

        if (oldOne.createdBy?.id !== deletedBy.id && !deletedBy.roles.includes(UserRole.Admin))
            throw new ForbiddenError(`Only creator or admin can delete ${tableName} ${id}`);

        await store.save({ id, deletedBy } as T);
        await store.softDelete(id);
    }

    async getList({ keywords, pageSize, pageIndex }: UserBaseFilter) {
        const where = searchConditionOf<T>(this.searchKeys, keywords);

        const [list, count] = await this.store.findAndCount({
            relations: ['createdBy'],
            where,
            skip: pageSize * (pageIndex - 1),
            take: pageSize,
        });
        return { list, count } as ListChunk<T>;
    }
}

export class CRUDServiceWithLog<T extends UserBase> extends CRUDService<T> {
    declare tableName: ActivityLog['tableName'];

    async createOne(data: Partial<T>, createdBy: User) {
        const createdOne = await super.createOne(data, createdBy);

        await activityLogService.logCreate(createdBy, this.tableName, createdOne.id);

        return createdOne;
    }

    async editOne(id: number, data: Partial<T>, updatedBy: User) {
        const updatedOne = await super.editOne(id, data, updatedBy);

        await activityLogService.logUpdate(updatedBy, this.tableName, id);

        return updatedOne;
    }

    async deleteOne(id: number, deletedBy: User) {
        await super.deleteOne(id, deletedBy);

        await activityLogService.logDelete(deletedBy, this.tableName, id);
    }
}

export class VerificationService<T extends VerificationBase> extends CRUDServiceWithLog<T> {
    createOne({ verifiedAt, verifiedBy, ...data }: Partial<T>, createdBy: User) {
        return super.createOne(data as Partial<T>, createdBy);
    }

    getOne(id: number, relations: string[] = ['createdBy', 'updatedBy', 'verifiedBy']) {
        return super.getOne(id, relations);
    }

    editOne(id: number, { verifiedAt, verifiedBy, ...data }: Partial<T>, updatedBy: User) {
        return super.editOne(
            id,
            { ...data, verifiedAt: null, verifiedBy: null } as Partial<T>,
            updatedBy,
        );
    }

    verifyOne(id: number, verifiedBy: User) {
        return super.editOne(
            id,
            { verifiedAt: new Date() + '', verifiedBy } as Partial<T>,
            verifiedBy,
        );
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
