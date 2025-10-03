import { ForbiddenError, NotFoundError } from 'routing-controllers';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, Not } from 'typeorm';

import {
    ActivityLog,
    BaseFilter,
    InputData,
    User,
    UserBase,
    UserBaseFilter,
    UserRole,
    VerificationBase,
    VerificationBaseFilter
} from '../model';
import { searchConditionOf } from '../utility';
import { activityLogService } from './ActivityLog';
import { BaseService } from './Base';

export class UserService<T extends UserBase> extends BaseService<T> {
    createOne(data: Partial<T>, createdBy: User) {
        return super.createOne({ ...data, createdBy });
    }

    getOne(id: number, relations: string[] = ['createdBy', 'updatedBy']) {
        return super.getOne(id, relations);
    }

    async editOne(id: number, data: Partial<T>, updatedBy: User) {
        const { tableName } = this;

        const oldOne = await this.getOne(id);

        if (!oldOne) throw new NotFoundError(`${tableName} ${id} is not found`);

        if (
            oldOne.createdBy?.id !== updatedBy.id &&
            !updatedBy.roles.includes(UserRole.Admin) &&
            !updatedBy.roles.includes(UserRole.Worker)
        )
            throw new ForbiddenError(`Only creator or staff can edit ${tableName} ${id}`);

        return super.editOne(id, { ...data, updatedBy });
    }

    async deleteOne(id: number, deletedBy: User) {
        const { store, tableName } = this;

        const oldOne = await store.findOne({
            where: { id } as FindOptionsWhere<T>,
            relations: ['createdBy']
        });

        if (!oldOne) throw new NotFoundError(`${tableName} ${id} is not found`);

        if (oldOne.createdBy?.id !== deletedBy.id && !deletedBy.roles.includes(UserRole.Admin))
            throw new ForbiddenError(`Only creator or admin can delete ${tableName} ${id}`);

        await store.save({ id, deletedBy } as T);
        return store.softDelete(id);
    }

    getList(
        { createdBy, updatedBy, keywords, ...filter }: UserBaseFilter,
        where?: FindOneOptions<T>['where'],
        options: FindManyOptions<T> = { relations: ['createdBy'] }
    ) {
        where ??= searchConditionOf<T>(this.searchKeys, keywords, {
            ...(createdBy ? { createdBy: { id: createdBy } } : {}),
            ...(updatedBy ? { updatedBy: { id: updatedBy } } : {})
        } as FindOptionsWhere<T>);

        return super.getList(
            { keywords, ...filter } as Partial<InputData<T>> & BaseFilter,
            where,
            options
        );
    }
}

export class CRUDServiceWithLog<T extends UserBase> extends UserService<T> {
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
        const result = await super.deleteOne(id, deletedBy);

        await activityLogService.logDelete(deletedBy, this.tableName, id);

        return result;
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
            updatedBy
        );
    }

    verifyOne(id: number, verifiedBy: User) {
        return super.editOne(
            id,
            { verifiedAt: new Date() + '', verifiedBy } as Partial<T>,
            verifiedBy
        );
    }

    getList(
        { verified, keywords, ...filter }: VerificationBaseFilter,
        where?: FindOneOptions<T>['where'],
        options: FindManyOptions<T> = { relations: ['createdBy', 'verifiedBy'] }
    ) {
        where ??= searchConditionOf<T>(this.searchKeys, keywords, {
            verifiedAt: verified ? Not(IsNull()) : verified === false ? IsNull() : undefined
        } as FindOptionsWhere<T>);

        return super.getList({ keywords, ...filter }, where, options);
    }
}
