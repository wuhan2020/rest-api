import { IsUrl } from 'class-validator';

export class SignedLink {
    @IsUrl()
    putLink: string;

    @IsUrl()
    getLink: string;
}
