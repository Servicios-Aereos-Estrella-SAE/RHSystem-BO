import type { DateTime } from "luxon"

interface EmployeeTypeInterface {
  employeeTypeId: number | null
  employeeTypeName: string
  employeeTypeSlug: string
  employeeTypeCreatedAt: DateTime
  employeeTypeUpdatedAt: DateTime
  deletedAt: DateTime | null
}

export type { EmployeeTypeInterface }
