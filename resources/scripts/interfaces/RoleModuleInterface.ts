import type { RoleInterface } from "./RoleInterface"
import type { SystemModuleInterface } from "./SystemModuleInterface"

interface RoleModuleInterface {
  role: RoleInterface,
  modules: Array<SystemModuleInterface>
}

export type { RoleModuleInterface }
