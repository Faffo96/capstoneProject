import { Role } from "./role";


export interface AuthData {
    accessToken: string,
    User: {
        name: string;
        surname: string;
        email: string;
        avatar: string;
        role: Role;
        creationDate: string;
      }
}
