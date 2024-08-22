import type { ProceedingFileInterface } from "./ProceedingFileInterface"

interface PilotProceedingFileInterface {
  pilotProceedingFileId: number | null
  pilotId: number | null
  proceedingFileId: number | null
  pilotProceedingFileCreatedAt: string | Date | null
  pilotProceedingFileUpdatedAt: string | Date | null
  pilotProceedingFileDeletedAt: string | Date | null
  proceedingFile?: ProceedingFileInterface
}

export type { PilotProceedingFileInterface }