import {
    JsonController,
    Post,
    Authorized,
    Body,
    ForbiddenError,
    Get,
    QueryParam,
    Param,
    Put,
    OnUndefined,
    Delete,
    NotFoundError,
    CurrentUser
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { OnNull } from 'routing-controllers';
import { queryPage, searchConditionOf } from '../utility';
import { Vendor, dataSource, UserRole, User } from '../model';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ActivityLogController } from './ActivityLog';

const vendorRepo = dataSource.getRepository(Vendor);

@JsonController('/vendor')
export class VendorController {
    @Post()
    @Authorized()
    @ResponseSchema(Vendor)
    async create(
        @CurrentUser() createdBy: User,
        @Body() vendor: Vendor
    ) {
        const savedVendor = await vendorRepo.save({ ...vendor, createdBy });
        
        await ActivityLogController.logCreate(createdBy, 'Vendor', savedVendor.id);
        
        return savedVendor;
    }

    @Get()
    @ResponseSchema(Array)
    getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('province') province: string,
        @QueryParam('city') city: string,
        @QueryParam('district') district: string,
        @QueryParam('name') name: string,
        @QueryParam('pageSize') size: number = 10,
        @QueryParam('pageIndex') index: number = 1
    ) {
        let where: FindOptionsWhere<Vendor> = {};
        
        if (verified !== undefined) where.verified = verified;
        if (province) where.province = province;
        if (city) where.city = city;
        if (district) where.district = district;
        
        if (name) {
            where.name = ILike(`%${name}%`);
        }

        return queryPage(vendorRepo, {
            size,
            index,
            where,
            relations: ['createdBy', 'verifier'],
            order: { updatedAt: 'DESC' }
        });
    }

    @Get('/:id')
    @ResponseSchema(Vendor)
    @OnNull(404)
    getOne(@Param('id') id: number) {
        return vendorRepo.findOne({
            where: { id },
            relations: ['createdBy', 'verifier']
        });
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(Vendor)
    async edit(
        @CurrentUser() updatedBy: User,
        @Param('id') id: number,
        @Body() { verified, ...vendor }: Vendor
    ) {     
        const existed = await vendorRepo.existsBy({ id });
        
        if (!existed)
            throw new NotFoundError('Vendor not found');

        if (verified != null && !updatedBy.roles.includes(UserRole.Admin))
            throw new ForbiddenError('Only Admin can verify vendors');

        const savedVendor = await vendorRepo.save({ 
            ...vendor, 
            id, 
            verified, 
            verifier: verified != null ? updatedBy : null, 
            updatedBy 
        });
        
        await ActivityLogController.logUpdate(updatedBy, 'Vendor', id);
        
        return savedVendor;
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(@CurrentUser() deletedBy: User, @Param('id') id: number) {
        const vendor = await vendorRepo.findOne({ 
            where: { id },
            relations: ['createdBy']
        });
        
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        if (vendor.createdBy?.id !== deletedBy.id && !deletedBy.roles.includes(UserRole.Admin)) {
            throw new ForbiddenError('Permission denied');
        }

        await vendorRepo.softDelete(id);
        await ActivityLogController.logDelete(deletedBy, 'Vendor', id);
    }
}
