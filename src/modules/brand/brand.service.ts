import { Injectable } from 'khamsa';
import logo from '@modules/brand/logo.svg';

@Injectable()
export class BrandService {
    public getLogo() {
        return logo;
    }
}
