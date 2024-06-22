import type { DepartmentInterface } from "./DepartmentInterface"
import type { PeopleInterface } from "./PeopleInterface"
import type { PositionInterface } from "./PositionInterface"

interface EmployeeInterface {
  employee_id: number | null,
  employee_sync_id: string,
  employee_code: string,
  employee_first_name: string,
  employee_last_name: string,
  employee_payroll_num: string | null,
  employee_hire_date: Date | string | null,
  company_id: number,
  department_id: number,
  position_id: number,
  department_sync_id: string,
  position_sync_id: string,
  person_id: number,
  employee_last_synchronization_at: Date | string | null,
  employee_created_at: Date | string | null,
  employee_updated_at: Date | string | null,
  employee_deleted_at: Date | string | null,

  person?: PeopleInterface,
  department?: DepartmentInterface,
  position?: PositionInterface
}

export type { EmployeeInterface }
