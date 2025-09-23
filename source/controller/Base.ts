import { Controller, Get } from 'routing-controllers';

@Controller()
export class BaseController {
    @Get('/')
    index() {
        return { message: 'Wuhan 2020 REST API' };
    }

    static entryOf(host: string) {
        return `Server runs at http://${host}`;
    }
}