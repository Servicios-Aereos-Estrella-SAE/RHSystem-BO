import type { EmployeeInterface } from "./EmployeeInterface"
import type { PeopleInterface } from "./PeopleInterface"
import type { RoleInterface } from "./RoleInterface"

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

  person?: PeopleInterface,
  employee?: EmployeeInterface
  role?: RoleInterface,
}

export type { UserInterface }
