import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('timestamp without time zone', { nullable: true })
    pubDate?: Date;

    @Column('text', { nullable: true })
    title?: string;

    @Column('text', { nullable: true })
    summary?: string;

    @Column('text', { nullable: true })
    infoSource?: string;

    @Column('text', { nullable: true })
    sourceUrl?: string;

    @Column('integer', { nullable: true })
    provinceId?: number;

    @Column('integer', { nullable: true })
    articleId?: number;

    @Column('text', { nullable: true })
    category?: string;

    @Column('text', { nullable: true })
    jumpUrl?: string;

    @Column('timestamp without time zone', { nullable: true })
    crawlTime?: Date;

    @Column('text', { nullable: true })
    picUrl?: string;

    @Column('text', { nullable: true })
    tag?: string;

    @Column('smallint', { nullable: true })
    entryWay?: number;

    @Column('smallint', { nullable: true })
    infoType?: number;

    @Column('smallint', { nullable: true })
    dataInfoState?: number;

    @Column('text', { nullable: true })
    dataInfoOperator?: string;

    @Column('timestamp without time zone', {
        nullable: true,
    })
    dataInfoTime?: Date;

    @Column('text', { nullable: true })
    provinceName?: string;

    @Column('text', { nullable: true })
    createTime?: string;

    @Column('text', { nullable: true })
    modifyTime?: string;

    @Column('smallint', { nullable: true })
    adoptType?: number;

    @Column('text', { nullable: true })
    body?: string;
}
