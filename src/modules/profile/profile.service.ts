import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import { Response } from '@modules/request/request.interface';
import { Profile } from '@modules/profile/profile.interface';

@Injectable()
export class ProfileService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async getProfile(): Promise<Response<Profile>> {
        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: '/user/profile',
            });
    }
}
