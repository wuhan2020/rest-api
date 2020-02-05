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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const leanengine_1 = require("leanengine");
const routing_controllers_1 = require("routing-controllers");
const utility_1 = require("../utility");
const model_1 = require("../model");
const Role_1 = require("./Role");
class Clinic extends leanengine_1.Object {
}
exports.Clinic = Clinic;
let ClinicController = class ClinicController {
    async create({ currentUser: user }, _a) {
        var { name } = _a, rest = __rest(_a, ["name"]);
        let clinic = await new leanengine_1.Query(Clinic).equalTo('name', name).first();
        if (clinic)
            throw new routing_controllers_1.ForbiddenError('同一义诊机构/个人不能重复发布，请联系原发布者修改');
        const acl = new leanengine_1.ACL();
        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true),
            acl.setRoleWriteAccess(await Role_1.RoleController.getAdmin(), true);
        clinic = await new Clinic()
            .setACL(acl)
            .save(Object.assign(Object.assign({}, rest), { name, creator: user, verified: false }), { user });
        return clinic.toJSON();
    }
    getList(verified, size, index) {
        return utility_1.queryPage(Clinic, {
            include: ['creator', 'verifier'],
            equal: { verified },
            size,
            index
        });
    }
    async getOne(id) {
        const clinic = await new leanengine_1.Query(Clinic).get(id);
        return clinic.toJSON();
    }
    async edit({ currentUser: user }, id, _a) {
        var { name } = _a, rest = __rest(_a, ["name"]);
        let clinic = leanengine_1.Object.createWithoutData('Clinic', id);
        await clinic.save(Object.assign(Object.assign({}, rest), { verified: false, verifier: null }), { user });
        clinic = await new leanengine_1.Query(Clinic).include('creator').get(id);
        return clinic.toJSON();
    }
    async verify({ currentUser: user }, id, { verified }) {
        if (!(await Role_1.RoleController.isAdmin(user)))
            throw new routing_controllers_1.ForbiddenError();
        await leanengine_1.Object.createWithoutData('Clinic', id).save({ verified, verifier: user }, { user });
    }
    async delete({ currentUser: user }, id) {
        await leanengine_1.Object.createWithoutData('Clinic', id).destroy({ user });
    }
};
__decorate([
    routing_controllers_1.Post(),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, model_1.ClinicModel]),
    __metadata("design:returntype", Promise)
], ClinicController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get(),
    __param(0, routing_controllers_1.QueryParam('verified')),
    __param(1, routing_controllers_1.QueryParam('pageSize')),
    __param(2, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number, Number]),
    __metadata("design:returntype", void 0)
], ClinicController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Put('/:id'),
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, model_1.ClinicModel]),
    __metadata("design:returntype", Promise)
], ClinicController.prototype, "edit", null);
__decorate([
    routing_controllers_1.Patch('/:id'),
    routing_controllers_1.Authorized(),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ClinicController.prototype, "verify", null);
__decorate([
    routing_controllers_1.Delete('/:id'),
    routing_controllers_1.Authorized(),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClinicController.prototype, "delete", null);
ClinicController = __decorate([
    routing_controllers_1.JsonController('/clinic')
], ClinicController);
exports.ClinicController = ClinicController;
//# sourceMappingURL=Clinic.js.map