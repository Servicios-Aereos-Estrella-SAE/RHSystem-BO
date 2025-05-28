interface ShiftExceptionEvidenceInterface {
  [key: string]: any
  shiftExceptionEvidenceId: number | null
  shiftExceptionEvidenceFile: string | null
  shiftExceptionEvidenceType: string | null
  shiftExceptionId: number,
  shiftExceptionEvidenceCreatedAt: Date | string | null
  shiftExceptionEvidenceUpdatedAt: Date | string | null
  shiftExceptionEvidenceDeletedAt: Date | string | null
}

export type { ShiftExceptionEvidenceInterface }
