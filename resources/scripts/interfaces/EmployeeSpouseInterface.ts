interface EmployeeSpouseInterface {
  employeeSpouseId: number | null
  employeeSpouseFirstname: string
  employeeSpouseLastname: string
  employeeSpouseSecondLastname: string
  employeeSpouseOcupation: string
  employeeSpousePhone: string | null
  employeeSpouseBirthday: Date | string | null
  employeeId: number
  employeeSpouseCreatedAt?: string | null
  employeeSpouseUpdatedAt?: string | null
  deletedAt?: string | null
}

export type { EmployeeSpouseInterface }