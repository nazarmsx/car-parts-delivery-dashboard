export class Admin {
    _id: string;
    login: string;
    password: string;
    access_token?:string;
    refresh_token?:string;
    claims?:any;
}