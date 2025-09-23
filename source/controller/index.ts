import type {} from 'koa2-swagger-ui';
import { createAPI } from 'koagger';

import { isProduct } from '../utility';
import { ActivityLogController } from './ActivityLog';
import { BaseController } from './Base';
import { MainController } from './Main';
import { SessionController } from './Session';
import { RoleController } from './Role';
import { UserController } from './User';
import { FileController } from './File';
import { RequirementController } from './SuppliesRequirement';
import { LogisticsController } from './Logistics';
import { HotelController } from './Hotel';
import { VendorController } from './Vendor';
import { ClinicController } from './Clinic';
import { DonationRecipientController } from './DonationRecipient';

export * from './ActivityLog';
export * from './Base';
export * from './Main';
export * from './Session';
export * from './Role';
export * from './User';
export * from './File';
export * from './SuppliesRequirement';
export * from './Logistics';
export * from './Hotel';
export * from './Vendor';
export * from './Clinic';
export * from './DonationRecipient';

export const controllers = [
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
    ActivityLogController,
    MainController,
    BaseController
];

export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers
});
