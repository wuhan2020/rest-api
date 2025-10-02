import { ConnectionOptions, parse } from 'pg-connection-string';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

import { DATABASE_URL, isProduct } from '../utility';
import { ActivityLog, UserRank } from './ActivityLog';
import { Clinic } from './Clinic';
import { DonationRecipient } from './Donation';
import {
    EpidemicAreaDaily,
    EpidemicCityMonthly,
    EpidemicCountryMonthly,
    EpidemicNews,
    EpidemicOverall,
    EpidemicProvinceMonthly,
    EpidemicRumor
} from './Epidemic';
import { Hotel } from './Hotel';
import { Logistics } from './Logistics';
import { SuppliesRequirement } from './Supplies';
import { User } from './User';
import { Vendor } from './Vendor';

const { ssl, host, port, user, password, database } = isProduct
    ? parse(DATABASE_URL)
    : ({} as ConnectionOptions);

const entities = [
    User,
    ActivityLog,
    UserRank,
    Vendor,
    Logistics,
    Clinic,
    Hotel,
    SuppliesRequirement,
    DonationRecipient,
    EpidemicRumor,
    EpidemicNews,
    EpidemicAreaDaily,
    EpidemicCountryMonthly,
    EpidemicProvinceMonthly,
    EpidemicCityMonthly,
    EpidemicOverall
];

const commonOptions: Pick<
    SqliteConnectionOptions,
    'logging' | 'synchronize' | 'entities' | 'migrations'
> = {
    logging: true,
    synchronize: true,
    entities,
    migrations: [`${isProduct ? '.data' : 'migration'}/*.ts`]
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
          ...commonOptions
      })
    : new DataSource({
          type: 'better-sqlite3',
          database: '.data/test.db',
          ...commonOptions
      });

export * from './ActivityLog';
export * from './Base';
export * from './Clinic';
export * from './Donation';
export * from './Epidemic';
export * from './File';
export * from './Hotel';
export * from './Logistics';
export * from './Place';
export * from './Session';
export * from './Supplies';
export * from './User';
export * from './Vendor';
