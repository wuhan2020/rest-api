import 'reflect-metadata';
import Koa from 'koa';
import Logger from 'koa-logger';
import jwt from 'koa-jwt';
import { useKoaServer } from 'routing-controllers';

import { dataSource, APP_SECRET, User } from './model/DataSource';
import { AuthenticatedContext } from './utility';
import { controllers, swagger, mocker } from './controller';
import { UserController } from './controller';

const { PORT, LEANCLOUD_APP_PORT: appPort } = process.env;

const port = parseInt(appPort || PORT || '8080');

console.time('Server boot');

const app = new Koa()
    .use(Logger())
    .use(swagger({ exposeSpec: true }))
    .use(jwt({
        secret: APP_SECRET,
        passthrough: true,
        key: 'jwtdata',
    }));

if (process.env.NODE_ENV !== 'production') {
    app.use(mocker());
}

useKoaServer(app, {
    cors: { credentials: true },
    authorizationChecker: ({ context }) => {
        const ctx = context as AuthenticatedContext;
        return !!(ctx.state.jwtdata || ctx.state.user);
    },
    currentUserChecker: ({ context }) => UserController.getSession({ context }),
    controllers
});

dataSource
    .initialize()
    .then(() =>
        app.listen(port, () => {
            console.log(`HTTP Server runs at http://localhost:${port}`);
            console.timeEnd('Server boot');
        }),
    )
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });
