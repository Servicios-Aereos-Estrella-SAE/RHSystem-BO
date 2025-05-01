import type { UserInterface } from "./UserInterface"

export interface UserResponsibleEmployeeInterface {
  userResponsibleEmployeeId: number | null
  userId: number | null
  employeeId: number
  userResponsibleEmployeeCreatedAt?: string
  userResponsibleEmployeeUpdatedAt?: string
  deletedAt?: string
  user?: UserInterface
}
