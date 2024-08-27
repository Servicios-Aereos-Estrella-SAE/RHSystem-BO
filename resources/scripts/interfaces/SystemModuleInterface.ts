
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
}

export type { SystemModuleInterface }
