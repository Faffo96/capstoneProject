export interface EmployeeResponseDTO {
    name: string;
    surname: string;
    email: string;
    avatar?: string;
    role: string;
    creationDate: Date;
    codiceFiscale: string;
    salary: number;
  }