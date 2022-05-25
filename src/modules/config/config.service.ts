import { Injectable } from 'khamsa';

declare const ORIGIN: string;

@Injectable()
export class ConfigService {
    public STARTUP_TAB_ID = '@@startup';
    public CLIENT_MEMBER_ALL_ROLE_TYPE = '@@all';
    public ORIGIN = ORIGIN;
    public ACCOUNT_CENTER_OAUTH2_CLIENT_ID = 'deef165b-9e97-4eda-ae4e-cfcc9480b1ea';
    public DEFAULT_PICTURE_URL = '/static/images/profile_avatar_fallback.svg';
}
