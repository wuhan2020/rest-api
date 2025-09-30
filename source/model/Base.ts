import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NewData } from 'mobx-restful';
import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { isEmpty } from 'web-utility';

export type InputData<T> = NewData<Omit<T, keyof Base>, Base>;

export class BaseFilter {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number = 10;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageIndex?: number = 1;

    @IsString()
    @IsOptional()
    keywords?: string;
}

export interface ListChunk<T> {
    count: number;
    list: T[];
}

export abstract class Base {
    static from<T extends Base = Base>(idOrData: number | object): T | undefined {
        if (isEmpty(idOrData)) return;

        const id = +idOrData,
            instance = Reflect.construct(this, []);

        return Object.assign(instance, isNaN(id) ? idOrData : { id });
    }

    @IsInt()
    @IsOptional()
    @PrimaryGeneratedColumn()
    id: number;

    @IsDateString()
    @IsOptional()
    @CreateDateColumn()
    createdAt: string;

    @IsDateString()
    @IsOptional()
    @UpdateDateColumn()
    updatedAt: string;

    @IsDateString()
    @IsOptional()
    @DeleteDateColumn({ select: false })
    deletedAt?: string;
}
