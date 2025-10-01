import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsNumberString,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { Base, ListChunk } from '../Base';

@Entity()
export class EpidemicOverall extends Base {
    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    dailyPic?: string;

    @IsUrl({}, { each: true })
    @IsOptional()
    @Column('simple-json', { nullable: true })
    dailyPics?: string[];

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    summary?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    countRemark?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    currentConfirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    confirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    suspectedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    curedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    deadCount?: number;

    @IsNumberString()
    @IsOptional()
    @Column('bigint', { nullable: true })
    seriousCount?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    suspectedIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    currentConfirmedIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    confirmedIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    curedIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    deadIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    seriousIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    yesterdayConfirmedCountIncr?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    yesterdaySuspectedCountIncr?: number;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    remark1?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    remark2?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    remark3?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    remark4?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    remark5?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    note1?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    note2?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    note3?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    generalRemark?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    abroadRemark?: string;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    marquee?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    quanguoTrendChart?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    hbFeiHbTrendChart?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    foreignTrendChart?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    importantForeignTrendChart?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    foreignTrendChartGlobal?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    importantForeignTrendChartGlobal?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    foreignStatistics?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    globalStatistics?: object;

    @IsObject()
    @IsOptional()
    @Column('simple-json', { nullable: true })
    globalOtherTrendChartData?: object;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    highDangerCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { nullable: true })
    midDangerCount?: number;

    @IsDateString()
    @IsOptional()
    @Column('date', { nullable: true })
    updateTime?: string;
}

export class OverallListChunk implements ListChunk<EpidemicOverall> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => EpidemicOverall)
    @ValidateNested({ each: true })
    list: EpidemicOverall[];
}
