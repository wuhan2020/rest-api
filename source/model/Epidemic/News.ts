import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { Base, ListChunk } from '../Base';

export abstract class PostBase extends Base {
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    title?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    summary?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    body?: string;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    sourceUrl?: string;

    @IsDateString()
    @IsOptional()
    @Column('date', { nullable: true })
    crawlTime?: string;
}

@Entity()
export class EpidemicNews extends PostBase {
    @IsDateString()
    @IsOptional()
    @Column('date', { nullable: true })
    pubDate?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    infoSource?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    provinceId?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    articleId?: number;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    category?: string;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    jumpUrl?: string;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    picUrl?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    tag?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    entryWay?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    infoType?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    dataInfoState?: number;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    dataInfoOperator?: string;

    @IsDateString()
    @IsOptional()
    @Column('date', { nullable: true })
    dataInfoTime?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    provinceName?: string;

    @IsDateString()
    @IsOptional()
    @Column({ nullable: true })
    createTime?: string;

    @IsDateString()
    @IsOptional()
    @Column({ nullable: true })
    modifyTime?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    adoptType?: number;
}

export class NewsListChunk implements ListChunk<EpidemicNews> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicNews)
    @ValidateNested({ each: true })
    list: EpidemicNews[];
}
