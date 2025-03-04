interface EmployeeContractInterface {
  [key: string]: any
  employeeContractId: number | null
  employeeContractUuid: string | null
  employeeContractFolio: string
  employeeContractStartDate: Date | string | null
  employeeContractEndDate: Date | string | null
  employeeContractStatus: string
  employeeContractMonthlyNetSalary: number
  employeeContractFile: string
  employeeContractTypeId: number | null
  employeeId: number | null
  departmentId: number | null
  positionId: number | null
  employeeContractCreatedAt?: Date | string | null
  employeeContractUpdatedAt?: Date | string | null
  employeeContractDeletedAt?: Date | string | null
}

export type { EmployeeContractInterface }
