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

import { AuthenticatedContext, queryPage } from '../utility';
import { LogisticsModel, Logistics, dataSource, UserRole } from '../model';

@JsonController('/logistics')
export class LogisticsController {
    @Post()
    @Authorized()
    async create(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Body() { name, ...rest }: LogisticsModel
    ) {
        if (!user) {
            throw new ForbiddenError('User not authenticated');
        }

        const logisticsRepo = dataSource.getRepository(Logistics);
        
        const existingLogistics = await logisticsRepo.findOne({ 
            where: { name } 
        });

        if (existingLogistics) {
            throw new ForbiddenError(
                '同一物流公司不能重复发布，请联系原发布者修改'
            );
        }

        const logistics = new Logistics();
        Object.assign(logistics, rest);
        logistics.name = name;
        logistics.createdBy = user;
        logistics.verified = false;

        const savedLogistics = await logisticsRepo.save(logistics);
        return savedLogistics;
    }

    @Get()
    getList(
        @QueryParam('verified') verified: boolean,
        @QueryParam('pageSize') size: number = 10,
        @QueryParam('pageIndex') index: number = 1
    ) {
        const logisticsRepo = dataSource.getRepository(Logistics);
        
        return queryPage(logisticsRepo, {
            size,
            index,
            where: verified !== undefined ? { verified } : {},
            relations: ['createdBy', 'verifier'],
            order: { updatedAt: 'DESC' }
        });
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        const logisticsRepo = dataSource.getRepository(Logistics);
        
        const logistics = await logisticsRepo.findOne({
            where: { id },
            relations: ['createdBy', 'verifier']
        });

        if (!logistics) {
            throw new NotFoundError('Logistics not found');
        }

        return logistics;
    }

    @Put('/:id')
    @Authorized()
    async edit(
        @Ctx() { state: { user } }: AuthenticatedContext,
        @Param('id') id: number,
        @Body() { name, ...rest }: LogisticsModel
    ) {
        if (!user) {
            throw new ForbiddenError('User not authenticated');
        }

        const logisticsRepo = dataSource.getRepository(Logistics);
        
        const logistics = await logisticsRepo.findOne({ where: { id } });
        if (!logistics) {
            throw new NotFoundError('Logistics not found');
        }

        Object.assign(logistics, rest);
        logistics.name = name;
        logistics.verified = false;
        logistics.verifier = undefined;
        logistics.updatedBy = user;

        const updatedLogistics = await logisticsRepo.save(logistics);
        return updatedLogistics;
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

        const logisticsRepo = dataSource.getRepository(Logistics);
        
        const logistics = await logisticsRepo.findOne({ where: { id } });
        if (!logistics) {
            throw new NotFoundError('Logistics not found');
        }

        logistics.verified = verified;
        logistics.verifier = user;
        logistics.updatedBy = user;

        await logisticsRepo.save(logistics);
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

        const logisticsRepo = dataSource.getRepository(Logistics);
        
        const logistics = await logisticsRepo.findOne({ 
            where: { id },
            relations: ['createdBy']
        });
        
        if (!logistics) {
            throw new NotFoundError('Logistics not found');
        }

        if (logistics.createdBy?.id !== user.id && !user.roles.includes(UserRole.Admin)) {
            throw new ForbiddenError('Permission denied');
        }

        await logisticsRepo.softRemove(logistics);
    }
}
