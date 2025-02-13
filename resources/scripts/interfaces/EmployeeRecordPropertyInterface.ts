interface EmployeeRecordPropertyInterface {
  employeeRecordPropertyId: number | null
  employeeRecordPropertyName: string
  employeeRecordPropertyType: string
  employeeRecordPropertyCategoryName: string
  employeeRecordPropertyCreatedAt: string | Date | null
  employeeRecordPropertyUpdatedAt: string | Date | null
  employeeRecordPropertyDeletedAt: string | Date | null
}

export type { EmployeeRecordPropertyInterface }