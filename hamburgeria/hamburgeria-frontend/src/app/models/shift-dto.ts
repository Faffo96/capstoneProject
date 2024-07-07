import { EmployeeResponseDTO } from "./employee-response-dto";

export interface ShiftDTO {
  id?: number;
  employee: EmployeeResponseDTO;
  startDate: string;
  endDate: string;
}