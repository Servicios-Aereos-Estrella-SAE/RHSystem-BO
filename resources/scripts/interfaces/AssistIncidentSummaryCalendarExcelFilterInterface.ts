import type { AssistDayInterface } from "./AssistDayInterface";
import type { EmployeeInterface } from "./EmployeeInterface";


interface AssistIncidentSummaryCalendarExcelFilterInterface {
  employee: EmployeeInterface,
  employeeCalendar: AssistDayInterface[],
  tardies: number,
  toleranceCountPerAbsences: number,
  dateEnd: string
}
export type { AssistIncidentSummaryCalendarExcelFilterInterface }
