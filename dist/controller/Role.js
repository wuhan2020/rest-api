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
var RoleController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const leanengine_1 = require("leanengine");
const model_1 = require("../model");
let RoleController = RoleController_1 = class RoleController {
    static getAdmin() {
        return new leanengine_1.Query(leanengine_1.Role).equalTo('name', model_1.UserRole.Admin).first();
    }
    static async create(name, user) {
        const acl = new leanengine_1.ACL();
        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true);
        const admin = await this.getAdmin();
        if (admin)
            acl.setRoleWriteAccess(admin, true);
        const role = new leanengine_1.Role(name, acl);
        role.getUsers().add(user);
        return role.save();
    }
    static async isAdmin(user) {
        const list = await user.getRoles();
        return !!list.find(role => role.getName() === model_1.UserRole.Admin);
    }
    async create({ currentUser }, { name }) {
        if (!(await RoleController_1.isAdmin(currentUser)))
            throw new routing_controllers_1.ForbiddenError();
        const role = await RoleController_1.create(name, currentUser);
        return role.toJSON();
    }
    async getAll({ currentUser }) {
        if (!(await RoleController_1.isAdmin(currentUser)))
            throw new routing_controllers_1.ForbiddenError();
        const list = await new leanengine_1.Query(leanengine_1.Role).find();
        return list.map(item => item.toJSON());
    }
};
__decorate([
    routing_controllers_1.Post(),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get(),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getAll", null);
RoleController = RoleController_1 = __decorate([
    routing_controllers_1.JsonController('/role')
], RoleController);
exports.RoleController = RoleController;
//# sourceMappingURL=Role.js.map