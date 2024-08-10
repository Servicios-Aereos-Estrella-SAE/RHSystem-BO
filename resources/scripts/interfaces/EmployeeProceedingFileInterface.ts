import type { ProceedingFileInterface } from "./ProceedingFileInterface"

interface EmployeeProceedingFileInterface {
  employeeProceedingFileId: number | null
  employeeId: number | null
  proceedingFileId: number | null
  employeeProceedingFileCreatedAt: string | Date | null
  employeeProceedingFileUpdatedAt: string | Date | null
  employeeProceedingFileDeletedAt: string | Date | null
  proceedingFile?: ProceedingFileInterface
}

export type { EmployeeProceedingFileInterface }