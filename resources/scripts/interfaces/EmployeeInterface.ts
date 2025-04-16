import type { DateTime } from "luxon"
import type { BusinessUnitInterface } from "./BusinessUnitInterface"
import type { DepartmentInterface } from "./DepartmentInterface"
import type { PeopleInterface } from "./PeopleInterface"
import type { PositionInterface } from "./PositionInterface"
import type { EmployeeAddressInterface } from "./EmployeeAddressInterface"

interface EmployeeInterface {
  employeeId: number | null,
  employeeSyncId: string,
  employeeCode: string,
  employeeFirstName: string,
  employeeLastName: string,
  employeePayrollNum: string | null,
  employeeHireDate: Date | string | null,
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
  employeeCreatedAt: Date | string | null,
  employeeUpdatedAt: Date | string | null,
  employeeDeletedAt: Date | string | null,
  deletedAt?: Date | string | null,

  person?: PeopleInterface,
  department?: DepartmentInterface,
  position?: PositionInterface,
  businessUnit?: BusinessUnitInterface
  address?: EmployeeAddressInterface[]
}

export type { EmployeeInterface }
