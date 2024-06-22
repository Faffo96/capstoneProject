import { Employee } from "./employee";

export interface Shift {
    id: number;
    employee: Employee;
    startDate: string; 
    endDate: string;
  }