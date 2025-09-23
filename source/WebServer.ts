import 'reflect-metadata';
import Koa from 'koa';
import Logger from 'koa-logger';
import jwt from 'koa-jwt';
import { useKoaServer } from 'routing-controllers';

import { dataSource, APP_SECRET, User } from './model/DataSource';
import { AuthenticatedContext } from './utility';
import {
    MainController,
    SessionController,
    RoleController,
    UserController,
    FileController,
    RequirementController,
    LogisticsController,
    HotelController,
    VendorController,
    ClinicController,
    DonationRecipientController,
} from './controller';

const { PORT, LEANCLOUD_APP_PORT: appPort } = process.env;

const port = parseInt(appPort || PORT || '8080');

console.time('Server boot');

const app = new Koa().use(Logger()).use(
    jwt({
        secret: APP_SECRET,
        passthrough: true,
        key: 'jwtdata',
    }),
);

useKoaServer(app, {
    cors: { credentials: true },
    authorizationChecker: ({ context }) => {
        const ctx = context as AuthenticatedContext;
        return !!(ctx.state.jwtdata || ctx.state.user);
    },
    currentUserChecker: async ({ context }) => {
        const ctx = context as AuthenticatedContext;
        if (ctx.state.user) return ctx.state.user;

        if (ctx.state.jwtdata) {
            const userRepo = dataSource.getRepository(User);
            const foundUser = await userRepo.findOne({
                where: { id: ctx.state.jwtdata.id },
            });
            ctx.state.user = foundUser || undefined;
        }

        return ctx.state.user;
    },
    controllers: [
        DonationRecipientController,
        ClinicController,
        VendorController,
        HotelController,
        LogisticsController,
        RequirementController,
        FileController,
        UserController,
        RoleController,
        SessionController,
        MainController,
    ],
});

dataSource
    .initialize()
    .then(() =>
        app.listen(port, () => {
            console.log('HTTP Server runs at http://localhost:' + port);
            console.timeEnd('Server boot');
        }),
    )
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });
