import './WebServer';

process.on('unhandledRejection', (reason: string | Error) =>
    console.error(reason)
);
