import { Role } from "./role";

export interface Employee {
    name: string;
    surname: string;
    email: string;
    password: string;
    avatar: string;
    role: Role;
    creationDate: string;
    codiceFiscale: string;
    salary: number;
    points: number;
  }