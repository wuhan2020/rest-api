"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const koa_1 = __importDefault(require("koa"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const leanengine_1 = require("leanengine");
const routing_controllers_1 = require("routing-controllers");
const controller_1 = require("./controller");
const { LEANCLOUD_APP_ID: appId, LEANCLOUD_APP_KEY: appKey, LEANCLOUD_APP_MASTER_KEY: masterKey, PORT, LEANCLOUD_APP_PORT: appPort } = process.env;
const port = parseInt(appPort || PORT || '8080');
leanengine_1.init({ appId, appKey, masterKey });
const app = new koa_1.default()
    .use(koa_logger_1.default())
    .use(leanengine_1.koa2())
    .use(
// @ts-ignore
leanengine_1.Cloud.CookieSession({
    framework: 'koa2',
    secret: appKey
}));
routing_controllers_1.useKoaServer(app, {
    cors: { credentials: true },
    authorizationChecker: ({ context }) => !!context.currentUser,
    controllers: [
        controller_1.DonationRecipientController,
        controller_1.ClinicController,
        controller_1.VendorController,
        controller_1.HotelController,
        controller_1.LogisticsController,
        controller_1.RequirementController,
        controller_1.FileController,
        controller_1.UserController,
        controller_1.RoleController,
        controller_1.SessionController,
        controller_1.MainController
    ]
});
app.listen(port, () => console.log('HTTP Server runs at http://localhost:' + port));
//# sourceMappingURL=WebServer.js.map