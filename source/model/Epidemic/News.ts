import { IsDateString, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
    @IsInt()
    @Min(1)
    @PrimaryGeneratedColumn()
    id: number;

    @IsDateString()
    @IsOptional()
    @Column('timestamp without time zone', { nullable: true })
    pubDate?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    title?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    summary?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    infoSource?: string;

    @IsUrl()
    @IsOptional()
    @Column('text', { nullable: true })
    sourceUrl?: string;

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
    @Column('text', { nullable: true })
    category?: string;

    @IsUrl()
    @IsOptional()
    @Column('text', { nullable: true })
    jumpUrl?: string;

    @IsDateString()
    @IsOptional()
    @Column('timestamp without time zone', { nullable: true })
    crawlTime?: string;

    @IsUrl()
    @IsOptional()
    @Column('text', { nullable: true })
    picUrl?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
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
    @Column('text', { nullable: true })
    dataInfoOperator?: string;

    @IsDateString()
    @IsOptional()
    @Column('timestamp without time zone', { nullable: true })
    dataInfoTime?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    provinceName?: string;

    @IsDateString()
    @IsOptional()
    @Column('text', { nullable: true })
    createTime?: string;

    @IsDateString()
    @IsOptional()
    @Column('text', { nullable: true })
    modifyTime?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    adoptType?: number;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    body?: string;
}
