interface EmployeeBankInterface {
  employeeBankId: number | null
  employeeBankAccountClabe: string | null
  employeeBankAccountClabeLastNumbers: string
  employeeBankAccountNumber: string | null
  employeeBankAccountNumberLastNumbers: string
  employeeBankAccountType: string | null
  employeeBankAccountCurrencyType: string
  employeeId: number
  bankId: number | null
  employeeBankCreatedAt?: string | null
  employeeBankUpdatedAt?: string | null
  deletedAt?: string | null
}

export type { EmployeeBankInterface }