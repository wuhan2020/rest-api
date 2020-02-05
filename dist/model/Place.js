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
class OrganizationModel {
}
__decorate([
    class_validator_1.IsUrl(),
    __metadata("design:type", String)
], OrganizationModel.prototype, "url", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], OrganizationModel.prototype, "contacts", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], OrganizationModel.prototype, "remark", void 0);
exports.OrganizationModel = OrganizationModel;
class PlaceModel extends OrganizationModel {
}
__decorate([
    class_validator_1.Length(3),
    __metadata("design:type", String)
], PlaceModel.prototype, "province", void 0);
__decorate([
    class_validator_1.Length(3),
    __metadata("design:type", String)
], PlaceModel.prototype, "city", void 0);
__decorate([
    class_validator_1.Length(2),
    __metadata("design:type", String)
], PlaceModel.prototype, "district", void 0);
__decorate([
    class_validator_1.Length(5),
    __metadata("design:type", String)
], PlaceModel.prototype, "address", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", Object)
], PlaceModel.prototype, "coords", void 0);
exports.PlaceModel = PlaceModel;
//# sourceMappingURL=Place.js.map