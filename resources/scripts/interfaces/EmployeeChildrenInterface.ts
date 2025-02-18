interface EmployeeChildrenInterface {
  employeeChildrenId: number | null
  employeeChildrenFirstname: string
  employeeChildrenLastname: string
  employeeChildrenSecondLastname: string
  employeeChildrenGender: string
  employeeChildrenBirthday: Date | string | null
  employeeId: number
  employeeChildrenCreatedAt?: string | null
  employeeChildrenUpdatedAt?: string | null
  deletedAt?: string | null
}

export type { EmployeeChildrenInterface }