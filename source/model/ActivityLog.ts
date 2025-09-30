import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, IsOptional, Min, ValidateNested } from 'class-validator';
import { Column, Entity, ViewColumn, ViewEntity } from 'typeorm';

import { Base, BaseFilter, InputData, ListChunk } from './Base';
import { User, UserBase } from './User';
import { SuppliesRequirement } from './Supplies';
import { Clinic } from './Clinic';
import { Hotel } from './Hotel';
import { Logistics } from './Logistics';
import { Vendor } from './Vendor';
import { DonationRecipient } from './Donation';

export enum Operation {
    Create = 'create',
    Update = 'update',
    Delete = 'delete',
}

export const LogableTable = {
    User,
    SuppliesRequirement,
    Clinic,
    Hotel,
    Logistics,
    Vendor,
    DonationRecipient,
};

const LogableTableEnum = Object.fromEntries(
    Object.entries(LogableTable).map(([key]) => [key, key]),
);

@Entity()
export class ActivityLog extends UserBase {
    @IsEnum(Operation)
    @Column({ type: 'simple-enum', enum: Operation })
    operation: Operation;

    @IsEnum(LogableTableEnum)
    @Column({ type: 'simple-enum', enum: LogableTableEnum })
    tableName: keyof typeof LogableTable;

    @IsInt()
    @Min(1)
    @Column()
    recordId: number;

    @IsObject()
    @IsOptional()
    record?: Base;
}

export class ActivityLogFilter extends BaseFilter implements Partial<InputData<ActivityLog>> {
    @IsEnum(Operation)
    @IsOptional()
    operation?: Operation;
}

export class ActivityLogListChunk implements ListChunk<ActivityLog> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => ActivityLog)
    @ValidateNested({ each: true })
    list: ActivityLog[];
}

@ViewEntity({
    expression: (connection) =>
        connection
            .createQueryBuilder()
            .from(ActivityLog, 'al')
            .groupBy('al.createdBy')
            .select('al.createdBy.id', 'userId')
            .addSelect('COUNT(al.id)', 'score'),
})
export class UserRank {
    @IsInt()
    @Min(1)
    @ViewColumn()
    userId: number;

    @Type(() => User)
    @ValidateNested()
    user: User;

    @ViewColumn()
    score: number;

    @IsInt()
    @Min(1)
    rank: number;
}

export class UserRankListChunk implements ListChunk<UserRank> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => UserRank)
    @ValidateNested({ each: true })
    list: UserRank[];
}
