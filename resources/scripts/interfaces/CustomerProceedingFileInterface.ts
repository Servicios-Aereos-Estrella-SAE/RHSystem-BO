import type { ProceedingFileInterface } from "./ProceedingFileInterface"

interface CustomerProceedingFileInterface {
  customerProceedingFileId: number | null
  customerId: number | null
  proceedingFileId: number | null
  customerProceedingFileCreatedAt: string | Date | null
  customerProceedingFileUpdatedAt: string | Date | null
  customerProceedingFileDeletedAt: string | Date | null
  proceedingFile?: ProceedingFileInterface
}

export type { CustomerProceedingFileInterface }