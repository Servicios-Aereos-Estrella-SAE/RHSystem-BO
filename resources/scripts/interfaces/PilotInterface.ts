import type { PeopleInterface } from "./PeopleInterface"

interface PilotInterface {
  [key: string]: any
  pilotId: number | null,
  pilotHireDate: Date | string | null,
  pilotPhoto: string | null,
  personId: number,
  pilotCreatedAt: Date | string | null,
  pilotUpdatedAt: Date | string | null,
  pilotDeletedAt: Date | string | null,

  person?: PeopleInterface,
}

export type { PilotInterface }
