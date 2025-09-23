import { User } from '../model';

export class ActivityLogController {
    static async logCreate(user: User, entity: string, entityId: number) {
        // TODO: Implement activity logging
        console.log(`User ${user.id} created ${entity} ${entityId}`);
    }

    static async logUpdate(user: User, entity: string, entityId: number) {
        // TODO: Implement activity logging
        console.log(`User ${user.id} updated ${entity} ${entityId}`);
    }

    static async logDelete(user: User, entity: string, entityId: number) {
        // TODO: Implement activity logging
        console.log(`User ${user.id} deleted ${entity} ${entityId}`);
    }
}