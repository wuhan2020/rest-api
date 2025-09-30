import { httpClient } from './shared';

describe('Base controller', () => {
    it('should echo Server entries in HTML', async () => {
        const { body } = await httpClient.get<string>(
            '/',
            {},
            { responseType: 'text' }
        );

        expect(body.trim()).toBe(
            `<ul>
<li>HTTP served at <a href="http://127.0.0.1:8080">http://127.0.0.1:8080</a></li>
<li>Swagger API served at <a href="http://127.0.0.1:8080/docs/">http://127.0.0.1:8080/docs/</a></li>
<li>Swagger API exposed at <a href="http://127.0.0.1:8080/docs/spec">http://127.0.0.1:8080/docs/spec</a></li>
<li>Mock API served at <a href="http://127.0.0.1:8080/mock/">http://127.0.0.1:8080/mock/</a></li>
</ul>`
        );
    });

    it('should echo a Health heart beat', async () => {
        const { status, body } = await httpClient.get<string>(
            '/_health',
            {},
            { responseType: 'text' }
        );
        expect(status).toBe(200);
        expect(body).toBe('');
    });
});
