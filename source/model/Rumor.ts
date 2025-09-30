import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { PostBase } from './News';

@Entity()
export class Rumor extends PostBase {
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    mainSummary?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    rumorType?: number;
}
