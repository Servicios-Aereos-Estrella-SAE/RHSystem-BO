import type { SystemPermissionInterface } from "./SystemPermissionInterface"

interface SystemModuleInterface {
  systemModuleId: number,
  systemModuleName: string,
  systemModuleSlug: string,
  systemModuleDescription: string,
  systemModules: number,
  systemModulePath: string,
  systemModuleGroup: string,
  systemModuleActive: number,
  systemModuleIcon: string,
  systemModuleCreatedAt: string,
  systemModuleUpdatedAt: string,
  systemModuleDeletedAt: string | null
  permissions: Array<SystemPermissionInterface>
}

export type { SystemModuleInterface }
