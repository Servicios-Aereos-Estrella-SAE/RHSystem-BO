import type { PeopleInterface } from "./PeopleInterface"

interface RoleInterface {
  roleId: number,
  roleName: string,
  roleDescription: string,
  roleSlug: string,
  roleActive: number,
  roleCreatedAt: string,
  roleUpdatedAt: string,
  roleDeletedAt: string | null
}

export type { RoleInterface }
