import type { PeopleInterface } from "./PeopleInterface"
import type { SystemPermissionInterface } from "./SystemPermissionInterface"

interface RoleSystemPermissionInterface {
  roleSystemPermissionId: number,
  roleId: number,
  systemPermissionId: number,
  roleSystemPermissionCreatedAt: string,
  roleSystemPermissionUpdatedAt: string,
  roleSystemPermissionDeletedAt: string | null
  systemPermissions: SystemPermissionInterface
}

export type { RoleSystemPermissionInterface }
