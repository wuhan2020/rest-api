import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Overall {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { nullable: true })
    dailyPic?: string;

    @Column('simple-json', { nullable: true })
    dailyPics?: object;

    @Column('text', { nullable: true })
    summary?: string;

    @Column('text', { nullable: true })
    countRemark?: string;

    @Column('integer', { nullable: true })
    currentConfirmedCount?: number;

    @Column('integer', { nullable: true })
    confirmedCount?: number;

    @Column('integer', { nullable: true })
    suspectedCount?: number;

    @Column('integer', { nullable: true })
    curedCount?: number;

    @Column('integer', { nullable: true })
    deadCount?: number;

    @Column('bigint', { nullable: true })
    seriousCount?: string;

    @Column('smallint', { nullable: true })
    suspectedIncr?: number;

    @Column('integer', { nullable: true })
    currentConfirmedIncr?: number;

    @Column('integer', { nullable: true })
    confirmedIncr?: number;

    @Column('smallint', { nullable: true })
    curedIncr?: number;

    @Column('smallint', { nullable: true })
    deadIncr?: number;

    @Column('integer', { nullable: true })
    seriousIncr?: number;

    @Column('integer', { nullable: true })
    yesterdayConfirmedCountIncr?: number;

    @Column('smallint', { nullable: true })
    yesterdaySuspectedCountIncr?: number;

    @Column('text', { name: 'remark1', nullable: true })
    remark1?: string;

    @Column('text', { name: 'remark2', nullable: true })
    remark2?: string;

    @Column('text', { name: 'remark3', nullable: true })
    remark3?: string;

    @Column('text', { name: 'remark4', nullable: true })
    remark4?: string;

    @Column('text', { name: 'remark5', nullable: true })
    remark5?: string;

    @Column('text', { name: 'note1', nullable: true })
    note1?: string;

    @Column('text', { name: 'note2', nullable: true })
    note2?: string;

    @Column('text', { name: 'note3', nullable: true })
    note3?: string;

    @Column('text', { nullable: true })
    generalRemark?: string;

    @Column('text', { nullable: true })
    abroadRemark?: string;

    @Column('simple-json', { nullable: true })
    marquee?: object;

    @Column('simple-json', { nullable: true })
    quanguoTrendChart?: object;

    @Column('simple-json', { nullable: true })
    hbFeiHbTrendChart?: object;

    @Column('simple-json', { nullable: true })
    foreignTrendChart?: object;

    @Column('simple-json', { nullable: true })
    importantForeignTrendChart?: object;

    @Column('simple-json', { nullable: true })
    foreignTrendChartGlobal?: object;

    @Column('simple-json', { nullable: true })
    importantForeignTrendChartGlobal?: object;

    @Column('simple-json', { nullable: true })
    foreignStatistics?: object;

    @Column('simple-json', { nullable: true })
    globalStatistics?: object;

    @Column('text', { nullable: true })
    globalOtherTrendChartData?: string;

    @Column('integer', { nullable: true })
    highDangerCount?: number;

    @Column('integer', { nullable: true })
    midDangerCount?: number;

    @Column('timestamp without time zone', { nullable: true })
    updateTime?: Date;
}
