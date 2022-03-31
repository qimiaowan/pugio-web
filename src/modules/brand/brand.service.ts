import { Injectable } from 'khamsa';
import logo from './logo.svg';

@Injectable()
export class BrandService {
    public getLogo() {
        return logo;
    }
}
