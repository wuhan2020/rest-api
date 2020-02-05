"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const leanengine_1 = require("leanengine");
const utility_1 = require("../utility");
const Role_1 = require("./Role");
let FileController = class FileController {
    async create({ currentUser }, { buffer, originalname }) {
        const acl = new leanengine_1.ACL();
        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(currentUser, true);
        const admin = await Role_1.RoleController.getAdmin();
        if (admin)
            acl.setRoleWriteAccess(admin, true);
        const file = await new leanengine_1.File(originalname, buffer).setACL(acl).save();
        return file.toJSON();
    }
    getList(size, index) {
        return utility_1.queryPage(leanengine_1.File, { size, index });
    }
    async delete({ currentUser: user }, id) {
        await leanengine_1.Object.createWithoutData('_File', id).destroy({ user });
    }
};
__decorate([
    routing_controllers_1.Post(),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.UploadedFile('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get(),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.QueryParam('pageSize')),
    __param(1, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Delete('/:id'),
    routing_controllers_1.Authorized(),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "delete", null);
FileController = __decorate([
    routing_controllers_1.JsonController('/file')
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=File.js.map