export interface EmployeeSupplyInterface {
  employeeSupplyId: number | null
  employeeId: number
  supplyId: number
  employeeSupplyStatus: string
  employeeSupplyRetirementReason: string | null
  employeeSupplyRetirementDate: Date | null
  employeeSupplyCreatedAt: Date | null
  employeeSupplyUpdatedAt: Date | null
  deletedAt: Date | null
}
