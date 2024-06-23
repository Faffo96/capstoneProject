import { Role } from "./role";

export interface Register {
    name: string;
    surname: string;
    email: string;
    password: string;
    avatar: string;
    role: Role;
    creationDate: string;
  }
