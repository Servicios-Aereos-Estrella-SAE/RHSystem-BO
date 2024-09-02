import type { PeopleInterface } from "./PeopleInterface"
import type { RoleSystemPermissionInterface } from "./RoleSystemPermissionInterface"

interface RoleInterface {
  roleId: number,
  roleName: string,
  roleDescription: string,
  roleSlug: string,
  roleActive: number,
  roleCreatedAt: string,
  roleUpdatedAt: string,
  roleDeletedAt: string | null
  roleSystemPermissions: [RoleSystemPermissionInterface]
}

export type { RoleInterface }
