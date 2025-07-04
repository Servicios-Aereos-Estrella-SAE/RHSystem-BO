import type { AssistDayInterface } from "./AssistDayInterface";
import type { EmployeeInterface } from "./EmployeeInterface";

interface AssistIncidentPayrollCalendarExcelFilterInterface {
  employee: EmployeeInterface,
  employeeCalendar: AssistDayInterface[],
  tardies: number,
  datePay: string,
  toleranceCountPerAbsences: number,
  employeeWorkDisabilities: EmployeeInterface[]
}
export type { AssistIncidentPayrollCalendarExcelFilterInterface }
