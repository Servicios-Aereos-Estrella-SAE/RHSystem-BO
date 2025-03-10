interface EmployeeEmergencyContactInterface {
  employeeEmergencyContactId: number | null
  employeeEmergencyContactFirstname: string
  employeeEmergencyContactLastname: string
  employeeEmergencyContactSecondLastname: string
  employeeEmergencyContactRelationship: string
  employeeEmergencyContactPhone: string | null
  employeeId: number
  employeeEmergencyContactCreatedAt?: string | null
  employeeEmergencyContactUpdatedAt?: string | null
  deletedAt?: string | null
}

export type { EmployeeEmergencyContactInterface }