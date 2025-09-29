import { IsDateString, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rumor {
    @IsInt()
    @Min(1)
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    title?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    mainSummary?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    summary?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    body?: string;

    @IsUrl()
    @IsOptional()
    @Column('text', { nullable: true })
    sourceUrl?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('smallint', { nullable: true })
    rumorType?: number;

    @IsDateString()
    @IsOptional()
    @Column('timestamp without time zone', { nullable: true })
    crawlTime?: string;
}
