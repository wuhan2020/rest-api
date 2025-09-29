import { S3Client } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { HTTPClient, HTTPError } from 'koajax';
import { HttpError } from 'routing-controllers';
import { FindOptionsWhere, ILike } from 'typeorm';

config({ path: [`.env.${process.env.NODE_ENV}.local`, '.env.local', '.env'] });

export const {
    NODE_ENV,
    HTTP_PROXY,
    PORT = 8080,
    DATABASE_URL,
    APP_SECRET,
    LEANCLOUD_API_HOST,
    LEANCLOUD_APP_ID,
    LEANCLOUD_APP_KEY,
    AWS_S3_END_POINT,
    AWS_S3_BUCKET,
    AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_PUBLIC_HOST
} = process.env;

export const isProduct = NODE_ENV === 'production';

export const searchConditionOf = <T extends object>(
    keys: (keyof T)[],
    keywords = '',
    filter?: FindOptionsWhere<T>
) => (keywords ? keys.map(key => ({ [key]: ILike(`%${keywords}%`), ...filter })) : filter);

export const leanClient = new HTTPClient({
    baseURI: `https://${LEANCLOUD_API_HOST}/1.1/`,
    responseType: 'json'
}).use(async ({ request }, next) => {
    request.headers = {
        ...request.headers,
        'X-LC-Id': LEANCLOUD_APP_ID,
        'X-LC-Key': LEANCLOUD_APP_KEY
    };
    try {
        await next();
    } catch (error) {
        const { response } = error as HTTPError<{
            code: number;
            error: string;
        }>;
        const { status, body } = response;

        throw new HttpError(status, body.error);
    }
});

export const s3Client = new S3Client({
    region: 'auto',
    endpoint: AWS_S3_END_POINT,
    credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
    }
});
