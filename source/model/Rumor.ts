import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rumor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { nullable: true })
    title?: string;

    @Column('text', { nullable: true })
    mainSummary?: string;

    @Column('text', { nullable: true })
    summary?: string;

    @Column('text', { nullable: true })
    body?: string;

    @Column('text', { nullable: true })
    sourceUrl?: string;

    @Column('smallint', { nullable: true })
    rumorType?: number;

    @Column('timestamp without time zone', { nullable: true })
    crawlTime?: Date;
}
