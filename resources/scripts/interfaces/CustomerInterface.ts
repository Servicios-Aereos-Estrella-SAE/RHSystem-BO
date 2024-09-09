import type { PeopleInterface } from "./PeopleInterface"

interface CustomerInterface {
  [key: string]: any
  customerId: number | null,
  customerUuid: string | null
  personId: number,
  customerCreatedAt: Date | string | null,
  customerUpdatedAt: Date | string | null,
  customerDeletedAt: Date | string | null,

  person?: PeopleInterface,
}

export type { CustomerInterface }
