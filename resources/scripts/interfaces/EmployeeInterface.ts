import type { DepartmentInterface } from "./DepartmentInterface"
import type { PeopleInterface } from "./PeopleInterface"
import type { PositionInterface } from "./PositionInterface"

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
  personId: number,
  employeeLastSynchronizationAt: Date | string | null,
  employeeCreatedAt: Date | string | null,
  employeeUpdatedAt: Date | string | null,
  employeeDeletedAt: Date | string | null,

  person?: PeopleInterface,
  department?: DepartmentInterface,
  position?: PositionInterface
}

export type { EmployeeInterface }
