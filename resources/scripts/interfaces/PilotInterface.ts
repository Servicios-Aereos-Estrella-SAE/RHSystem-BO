import type { EmployeeInterface } from "./EmployeeInterface"
import type { PeopleInterface } from "./PeopleInterface"

interface PilotInterface {
  [key: string]: any
  pilotId: number | null,
  pilotHireDate: Date | string | null,
  pilotPhoto: string | null,
  employeeId: number,
  pilotCreatedAt: Date | string | null,
  pilotUpdatedAt: Date | string | null,
  pilotDeletedAt: Date | string | null,

  employee?: EmployeeInterface,
}

export type { PilotInterface }
