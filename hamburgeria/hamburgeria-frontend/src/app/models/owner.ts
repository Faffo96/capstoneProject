import { Role } from "./role";

export interface Owner {
    name: string;
    surname: string;
    email: string;
    password: string;
    avatar: string;
    role: Role;
    creationDate: string; 
    points: number;
  }