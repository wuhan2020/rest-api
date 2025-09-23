import {
    JsonController,
    Post,
    Authorized,
    Ctx,
    Body,
    ForbiddenError,
    Get,
    QueryParam,
    Param,
    Put,
    Patch,
    OnUndefined,
    Delete,
    NotFoundError
} from 'routing-controllers';
import { AuthenticatedContext, queryPage, searchConditionOf } from '../utility';
import { VendorModel, Vendor, dataSource, UserRole } from '../model';
import { FindOptionsWhere, ILike } from 'typeorm';

@JsonController('/vendor')
export class VendorController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Body() { name, coords, ...rest }: VendorModel
    ) {
        if (!user) {
            throw new ForbiddenError('User not authenticated');
        }

        const vendorRepo = dataSource.getRepository(Vendor);
        
        // Check if vendor with same name already exists
        const existingVendor = await vendorRepo.findOne({ 
            where: { name } 
        });

        if (existingVendor) {
            throw new ForbiddenError(
                '同一供应商不能重复发布，请联系原发布者修改'
            );
        }

        const vendor = new Vendor();
        Object.assign(vendor, rest);
        vendor.name = name;
        vendor.coords = coords;
        vendor.createdBy = user;
        vendor.verified = false;

        const savedVendor = await vendorRepo.save(vendor);
        return savedVendor;
    }

    @Get()
    async getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('province') province: string,
        @QueryParam('city') city: string,
        @QueryParam('district') district: string,
        @QueryParam('name') name: string,
        @QueryParam('pageSize') size: number = 10,
        @QueryParam('pageIndex') index: number = 1
    ) {
        const vendorRepo = dataSource.getRepository(Vendor);
        
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
    async getOne(@Param('id') id: number) {
        const vendorRepo = dataSource.getRepository(Vendor);
        
        const vendor = await vendorRepo.findOne({
            where: { id },
            relations: ['createdBy', 'verifier']
        });

        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        return vendor;
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Param('id') id: number,
        @Body() { name, coords, ...rest }: VendorModel
    ) {
        if (!user) {
            throw new ForbiddenError('User not authenticated');
        }

        const vendorRepo = dataSource.getRepository(Vendor);
        
        const vendor = await vendorRepo.findOne({ 
            where: { id },
            relations: ['createdBy'] 
        });
        
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        // Update vendor properties
        Object.assign(vendor, rest);
        vendor.name = name;
        vendor.coords = coords;
        vendor.verified = false;
        vendor.verifier = undefined;
        vendor.updatedBy = user;

        const updatedVendor = await vendorRepo.save(vendor);
        return updatedVendor;
    }

    @Patch('/:id')
    @Authorized()
    @OnUndefined(204)
    async verify(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Param('id') id: number,
        @Body() { verified }: { verified: boolean }
    ) {
        if (!user || !user.roles.includes(UserRole.Admin)) {
            throw new ForbiddenError('Admin access required');
        }

        const vendorRepo = dataSource.getRepository(Vendor);
        
        const vendor = await vendorRepo.findOne({ where: { id } });
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        vendor.verified = verified;
        vendor.verifier = user;
        vendor.updatedBy = user;

        await vendorRepo.save(vendor);
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async delete(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Param('id') id: number
    ) {
        if (!user) {
            throw new ForbiddenError('User not authenticated');
        }

        const vendorRepo = dataSource.getRepository(Vendor);
        
        const vendor = await vendorRepo.findOne({ 
            where: { id },
            relations: ['createdBy']
        });
        
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        // Check if user has permission to delete (creator or admin)
        if (vendor.createdBy?.id !== user.id && !user.roles.includes(UserRole.Admin)) {
            throw new ForbiddenError('Permission denied');
        }

        await vendorRepo.softRemove(vendor);
    }
}
