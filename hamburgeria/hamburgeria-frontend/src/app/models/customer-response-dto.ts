import { Role } from "./role";

export interface CustomerResponseDTO {
    name: string;
    surname: string;
    email: string;
    avatar: string;
    role: Role;
    creationDate: string;
  }