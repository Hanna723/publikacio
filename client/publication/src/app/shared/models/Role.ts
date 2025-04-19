export interface Role {
    _id: string;
    name: RoleName;
}

export enum RoleName {
    AUTHOR = 'Author',
    REVIEWER = 'Reviewer',
    EDITOR = 'Editor'
}