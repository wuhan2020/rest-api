import { User, ActivityLog, Operation, dataSource } from '../model';

export class ActivityLogService {
    store = dataSource.getRepository(ActivityLog);

    logCreate(createdBy: User, tableName: ActivityLog['tableName'], recordId: number) {
        const operation = Operation.Create;

        return this.store.save({ createdBy, operation, tableName, recordId });
    }

    logUpdate(createdBy: User, tableName: ActivityLog['tableName'], recordId: number) {
        const operation = Operation.Update;

        return this.store.save({ createdBy, operation, tableName, recordId });
    }

    logDelete(createdBy: User, tableName: ActivityLog['tableName'], recordId: number) {
        const operation = Operation.Delete;

        return this.store.save({ createdBy, operation, tableName, recordId });
    }
}

export const activityLogService = new ActivityLogService();
