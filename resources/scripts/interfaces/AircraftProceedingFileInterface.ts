import type { ProceedingFileInterface } from "./ProceedingFileInterface"

interface AircraftProceedingFileInterface {
  aircraftProceedingFileId: number | null
  aircraftId: number | null
  proceedingFileId: number | null
  aircraftProceedingFileCreatedAt: string | Date | null
  aircraftProceedingFileUpdatedAt: string | Date | null
  aircraftProceedingFileDeletedAt: string | Date | null
  proceedingFile?: ProceedingFileInterface
}

export type { AircraftProceedingFileInterface }
