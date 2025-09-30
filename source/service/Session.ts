import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';

import { User, EmailSignInData, PhoneSignInData, UserRole, JWTAction, dataSource } from '../model';
import { APP_SECRET } from '../utility';
import { activityLogService } from './ActivityLog';

export class SessionService {
    userStore = dataSource.getRepository(User);

    encrypt = (raw: string) =>
        createHash('sha1')
            .update(APP_SECRET + raw)
            .digest('hex');

    sign = (user: User): User => ({
        ...user,
        token: sign({ ...user }, APP_SECRET),
    });

    async signUp(data: EmailSignInData | PhoneSignInData) {
        const { userStore } = this;

        const sum = await userStore.count();

        const { password: _, ...user } = await userStore.save({
            name: 'email' in data ? data.email : data.mobilePhone,
            ...data,
            password: this.encrypt(data.password),
            roles: [sum ? UserRole.Client : UserRole.Admin],
        });
        await activityLogService.logCreate(user, 'User', user.id);

        return user;
    }

    checkJWT = ({ context: { state } }: JWTAction) =>
        'user' in state ? state.user : (console.error(state.jwtOriginalError), null);
}

export const sessionService = new SessionService();
