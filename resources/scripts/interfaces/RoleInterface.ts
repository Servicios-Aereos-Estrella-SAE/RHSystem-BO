import type { RoleDepartmentInterface } from "./RoleDepartmentsInterface"
import type { RoleSystemPermissionInterface } from "./RoleSystemPermissionInterface"

interface RoleInterface {
  roleId: number,
  roleName: string,
  roleDescription: string,
  roleSlug: string,
  roleActive: number,
  roleManagementDays: number | null,
  roleCreatedAt: string,
  roleUpdatedAt: string,
  roleDeletedAt: string | null
  roleSystemPermissions: [RoleSystemPermissionInterface]
  roleDepartments: [RoleDepartmentInterface]
}

export type { RoleInterface }
