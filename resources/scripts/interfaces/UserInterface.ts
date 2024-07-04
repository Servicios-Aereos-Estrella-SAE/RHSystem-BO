import type { PeopleInterface } from "./PeopleInterface"

interface UserInterface {
  deletedAt?: string | null,
  personId: number | null,
  roleId: number | null,
  userActive: number,
  userCreatedAt?: string,
  userEmail: string | null,
  userPassword?: string,
  userId: number | null,
  userToken?: string | null,
  userUpdatedAt?: string,

  person?: PeopleInterface
}

export type { UserInterface }
