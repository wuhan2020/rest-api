import { ConnectionOptions, parse } from 'pg-connection-string';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

import { DATABASE_URL, isProduct } from '../utility';
import { ActivityLog } from './ActivityLog';
import { User } from './User';
import { Vendor } from './Vendor';
import { Logistics } from './Logistics';
import { Clinic } from './Clinic';
import { Hotel } from './Hotel';
import { SuppliesRequirement } from './Supplies';
import { DonationRecipient } from './Donation';
import { EpidemicStatistic, News, Overall, Rumor } from './Epidemic';

const { ssl, host, port, user, password, database } = isProduct
    ? parse(DATABASE_URL)
    : ({} as ConnectionOptions);

const entities = [
    User,
    ActivityLog,
    Vendor,
    Logistics,
    Clinic,
    Hotel,
    SuppliesRequirement,
    DonationRecipient,
    Rumor,
    News,
    EpidemicStatistic,
    Overall,
];

const commonOptions: Pick<
    SqliteConnectionOptions,
    'logging' | 'synchronize' | 'entities' | 'migrations'
> = {
    logging: true,
    synchronize: true,
    entities,
    migrations: [`${isProduct ? '.data' : 'migration'}/*.ts`],
};

export const dataSource = isProduct
    ? new DataSource({
          type: 'postgres',
          ssl: ssl as boolean,
          host,
          port: +port,
          username: user,
          password,
          database,
          ...commonOptions,
      })
    : new DataSource({
          type: 'better-sqlite3',
          database: '.data/test.db',
          ...commonOptions,
      });

export * from './ActivityLog';
export * from './Base';
export * from './File';
export * from './User';
export * from './Session';
export * from './Place';
export * from './Vendor';
export * from './Logistics';
export * from './Clinic';
export * from './Hotel';
export * from './Supplies';
export * from './Donation';
export * from './Epidemic';
