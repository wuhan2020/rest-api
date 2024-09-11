import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Area {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { nullable: true })
    continentName?: string;

    @Column('text', { nullable: true })
    continentEnglishName?: string;

    @Column('text', { nullable: true })
    countryName?: string;

    @Column('text', { nullable: true })
    countryEnglishName?: string;

    @Column('text', { nullable: true })
    provinceName?: string;

    @Column('text', { nullable: true })
    provinceEnglishName?: string;

    @Column('text', { name: 'province_zipCode', nullable: true })
    provinceZipCode?: string;

    @Column('integer', { name: 'province_confirmedCount', nullable: true })
    provinceConfirmedCount?: number;

    @Column('integer', { name: 'province_suspectedCount', nullable: true })
    provinceSuspectedCount?: number;

    @Column('integer', { name: 'province_curedCount', nullable: true })
    provinceCuredCount?: number;

    @Column('integer', { name: 'province_deadCount', nullable: true })
    provinceDeadCount?: number;

    @Column('timestamp without time zone', { nullable: true })
    updateTime?: Date;

    @Column('text', { nullable: true })
    cityName?: string;

    @Column('text', { nullable: true })
    cityEnglishName?: string;

    @Column('text', { name: 'city_zipCode', nullable: true })
    cityZipCode?: string;

    @Column('integer', { name: 'city_confirmedCount', nullable: true })
    cityConfirmedCount?: number;

    @Column('integer', { name: 'city_suspectedCount', nullable: true })
    citySuspectedCount?: number;

    @Column('integer', { name: 'city_curedCount', nullable: true })
    cityCuredCount?: number;

    @Column('integer', { name: 'city_deadCount', nullable: true })
    cityDeadCount?: number;
}
