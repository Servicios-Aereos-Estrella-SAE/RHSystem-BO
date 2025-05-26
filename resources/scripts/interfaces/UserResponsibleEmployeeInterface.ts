import type { EmployeeInterface } from "./EmployeeInterface"
import type { UserInterface } from "./UserInterface"

export interface UserResponsibleEmployeeInterface {
  userResponsibleEmployeeId: number | null
  userId: number | null
  employeeId: number
  userResponsibleEmployeeReadonly: number
  userResponsibleEmployeeDirectBoss: number
  userResponsibleEmployeeCreatedAt?: string
  userResponsibleEmployeeUpdatedAt?: string
  deletedAt?: string
  user?: UserInterface
  employeeAssigned?: EmployeeInterface
}
