import type { SystemModuleInterface } from "./SystemModuleInterface"

interface SystemPermissionInterface {
  systemPermissionId: number,
  systemPermissionName: string,
  systemPermissionSlug: string,
  systemPermissionDescription: string,
  systemModuleid: number,
  systemPermissionCreatedAt: string,
  systemPermissionUpdatedAt: string,
  systemPermissionDeletedAt: string | null
  systemModule: SystemModuleInterface
}

export type { SystemPermissionInterface }
