import type { EmployeeInterface } from "./EmployeeInterface"
import type { PeopleInterface } from "./PeopleInterface"

interface FlightAttendantInterface {
  [key: string]: any
  flightAttendantId: number | null,
  flightAttendantHireDate: Date | string | null,
  flightAttendantPhoto: string | null,
  employeeId: number,
  flightAttendantCreatedAt: Date | string | null,
  flightAttendantUpdatedAt: Date | string | null,
  flightAttendantDeletedAt: Date | string | null,

  employee?: EmployeeInterface,
}

export type { FlightAttendantInterface }
