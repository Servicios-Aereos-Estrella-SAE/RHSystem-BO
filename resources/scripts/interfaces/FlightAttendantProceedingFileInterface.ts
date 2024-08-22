import type { ProceedingFileInterface } from "./ProceedingFileInterface"

interface FlightAttendantProceedingFileInterface {
  flightAttendantProceedingFileId: number | null
  flightAttendantId: number | null
  proceedingFileId: number | null
  flightAttendantProceedingFileCreatedAt: string | Date | null
  flightAttendantProceedingFileUpdatedAt: string | Date | null
  flightAttendantProceedingFileDeletedAt: string | Date | null
  proceedingFile?: ProceedingFileInterface
}

export type { FlightAttendantProceedingFileInterface }