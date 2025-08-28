import type { DateTime } from "luxon"
import type { BusinessUnitInterface } from "./BusinessUnitInterface"
import type { DepartmentInterface } from "./DepartmentInterface"
import type { PeopleInterface } from "./PeopleInterface"
import type { PositionInterface } from "./PositionInterface"
import type { EmployeeAddressInterface } from "./EmployeeAddressInterface"
import type { ShiftExceptionInterface } from "./ShiftExceptionInterface"
import type { CalendarDayFault } from "./CalendarDayFault"
import type { AssistDayInterface } from "./AssistDayInterface"

interface EmployeeInterface {
  employeeId: number | null,
  employeeSyncId: string,
  employeeCode: string,
  employeeFirstName: string,
  employeeLastName: string,
  employeeSecondLastName: string,
  employeePayrollNum: string | null,
  employeeHireDate: Date | string | null,
  dailySalary: number,
  companyId: number,
  departmentId: number,
  positionId: number,
  departmentSyncId: string,
  positionSyncId: string,
  employeePhoto: string | null,
  employeeWorkSchedule: string | null,
  personId: number,
  businessUnitId: number,
  payrollBusinessUnitId: number | null
  employeeAssistDiscriminator: number,
  employeeLastSynchronizationAt: Date | string | null,
  employeeTypeOfContract: string | null,
  employeeTerminatedDate: string | null | DateTime | Date
  employeeTypeId: number,
  employeeBusinessEmail: string | null,
  employeeIgnoreConsecutiveAbsences: number,
  employeeCreatedAt: Date | string | null,
  employeeUpdatedAt: Date | string | null,
  employeeDeletedAt: Date | string | null,
  deletedAt?: Date | string | null,

  person?: PeopleInterface,
  department?: DepartmentInterface,
  position?: PositionInterface,
  businessUnit?: BusinessUnitInterface,
  address?: EmployeeAddressInterface[],
  shift_exceptions?: ShiftExceptionInterface[],
  faultDays?: CalendarDayFault[]
  calendar?: AssistDayInterface[]

  userResponsibleEmployeeChecked?: boolean,
  userResponsibleEmployeeReadonly?: boolean,
  userResponsibleEmployeeDirectBoss: boolean,
}

export type { EmployeeInterface }
