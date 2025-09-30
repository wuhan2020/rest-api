import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { PostBase } from './Epidemic/News';

@Entity()
export class EpidemicRumor extends PostBase {
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

export class RumorListChunk implements ListChunk<EpidemicRumor> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicRumor)
    @ValidateNested({ each: true })
    list: EpidemicRumor[];
}
