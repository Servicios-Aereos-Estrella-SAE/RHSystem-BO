interface EmployeeRecordInterface {
  employeeRecordId: number | null
  employeeRecordPropertyId: number
  employeeId: number
  employeeRecordValue: string
  employeeRecordActive: number
  employeeRecordCreatedAt: string | Date | null
  employeeRecordUpdatedAt: string | Date | null
  employeeRecordDeletedAt: string | Date | null
}

export type { EmployeeRecordInterface }