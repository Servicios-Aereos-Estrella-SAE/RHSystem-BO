import type { PeopleInterface } from "./PeopleInterface"

interface FlightAttendantInterface {
  [key: string]: any
  flightAttendantId: number | null,
  flightAttendantHireDate: Date | string | null,
  flightAttendantPhoto: string | null,
  personId: number,
  flightAttendantCreatedAt: Date | string | null,
  flightAttendantUpdatedAt: Date | string | null,
  flightAttendantDeletedAt: Date | string | null,

  person?: PeopleInterface,
}

export type { FlightAttendantInterface }
