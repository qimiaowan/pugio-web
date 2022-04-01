export interface Profile {
    id: string;
    picture: string;
    email: string;
    fullName?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
}

export interface ProfileMenuProps {
    profile?: Partial<Profile>;
}
