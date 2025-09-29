import { IsDateString, IsInt, IsOptional, IsPostalCode, IsString, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EpidemicStatistic {
    @IsInt()
    @Min(1)
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    continentName?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    continentEnglishName?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    countryName?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    countryEnglishName?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    provinceName?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    provinceEnglishName?: string;

    @IsPostalCode()
    @IsOptional()
    @Column('text', { name: 'province_zipCode', nullable: true })
    provinceZipCode?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'province_confirmedCount', nullable: true })
    provinceConfirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'province_suspectedCount', nullable: true })
    provinceSuspectedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'province_curedCount', nullable: true })
    provinceCuredCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'province_deadCount', nullable: true })
    provinceDeadCount?: number;

    @IsDateString()
    @IsOptional()
    @Column('timestamp without time zone', { nullable: true })
    updateTime?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    cityName?: string;

    @IsString()
    @IsOptional()
    @Column('text', { nullable: true })
    cityEnglishName?: string;

    @IsPostalCode()
    @IsOptional()
    @Column('text', { name: 'city_zipCode', nullable: true })
    cityZipCode?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'city_confirmedCount', nullable: true })
    cityConfirmedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'city_suspectedCount', nullable: true })
    citySuspectedCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'city_curedCount', nullable: true })
    cityCuredCount?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Column('integer', { name: 'city_deadCount', nullable: true })
    cityDeadCount?: number;
}
