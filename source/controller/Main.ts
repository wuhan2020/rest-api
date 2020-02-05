import { Controller, Get } from 'routing-controllers';

@Controller()
export class MainController {
    @Get('/')
    getSession() {
        return 'Hello, World!';
    }
}
