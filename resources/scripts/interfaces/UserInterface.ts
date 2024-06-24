import type { PeopleInterface } from "./PeopleInterface"

interface UserInterface {
  deletedAt: string | null,
  personId: number,
  roleId: number,
  userActive: number,
  userCreatedAt: string,
  userEmail: string,
  userPassword?: string,
  userId: number,
  userToken: string | null,
  userUpdatedAt: string,

  person?: PeopleInterface
}

export type { UserInterface }
