import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables
config({ path: [`.env.${process.env.NODE_ENV}.local`, '.env.local', '.env'] });

export const {
    NODE_ENV,
    PORT = 8080,
    DATABASE_URL,
    APP_SECRET = 'default-secret-key',
} = process.env;

export const isProduct = NODE_ENV === 'production';

// Import all entities
import { User } from './User';
import { Vendor } from './Vendor';
import { Logistics } from './Logistics';
import { Clinic } from './Clinic';
import { Hotel } from './Hotel';
import { SuppliesRequirement } from './SuppliesRequirement';
import { DonationRecipient } from './DonationRecipient';

const entities = [
    User,
    Vendor,
    Logistics,
    Clinic,
    Hotel,
    SuppliesRequirement,
    DonationRecipient,
];

// Parse DATABASE_URL for production
const parseDatabaseUrl = (url: string) => {
    const matches = url.match(
        /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );
    if (!matches) throw new Error('Invalid DATABASE_URL format');

    return {
        username: matches[1],
        password: matches[2],
        host: matches[3],
        port: parseInt(matches[4]),
        database: matches[5],
    };
};

export const dataSource =
    DATABASE_URL && isProduct
        ? new DataSource({
              type: 'postgres',
              ...parseDatabaseUrl(DATABASE_URL),
              ssl: { rejectUnauthorized: false },
              logging: !isProduct,
              synchronize: true,
              entities,
              migrations: [`dist/migration/*.js`],
          })
        : new DataSource({
              type: 'better-sqlite3',
              database: '.data/dev.db',
              logging: !isProduct,
              synchronize: true,
              entities,
              migrations: [`source/migration/*.ts`],
          });

export * from './Base';
export * from './User';
export * from './Vendor';
export * from './Logistics';
export * from './Clinic';
export * from './Hotel';
export * from './SuppliesRequirement';
export * from './DonationRecipient';
