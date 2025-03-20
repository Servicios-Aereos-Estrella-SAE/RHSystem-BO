interface ProceedingFileInterface {
  [key: string]: any
  proceedingFileId: number | null
  proceedingFileName: string | null
  proceedingFilePath: string
  proceedingFileTypeId: number | null
  proceedingFileExpirationAt: Date | string | null
  proceedingFileActive: number
  proceedingFileObservations: string
  proceedingFileCreatedAt: Date | string | null
  proceedingFileUpdatedAt: Date | string | null
  proceedingFileDeletedAt: Date | string | null
}

export type { ProceedingFileInterface }
