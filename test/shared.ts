import 'dotenv/config';

import { HTTPClient } from 'koajax';

import { Api } from './client';

export const { PORT = 8080, GITHUB_PAT } = process.env;

export const httpClient = new HTTPClient({
    baseURI: `http://127.0.0.1:${PORT}`,
    responseType: 'json'
});

export const client = new Api({ baseUrl: httpClient.baseURI });
