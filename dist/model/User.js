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
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
    Gender[Gender["Other"] = 2] = "Other";
})(Gender = exports.Gender || (exports.Gender = {}));
class UserModel {
}
__decorate([
    class_validator_1.IsMobilePhone('zh-CN'),
    __metadata("design:type", String)
], UserModel.prototype, "mobilePhoneNumber", void 0);
__decorate([
    class_validator_1.Length(3),
    __metadata("design:type", String)
], UserModel.prototype, "name", void 0);
__decorate([
    class_validator_1.IsEnum(Gender),
    __metadata("design:type", Number)
], UserModel.prototype, "gender", void 0);
__decorate([
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], UserModel.prototype, "age", void 0);
__decorate([
    class_validator_1.IsUrl(),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
exports.UserModel = UserModel;
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "Admin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
//# sourceMappingURL=User.js.map