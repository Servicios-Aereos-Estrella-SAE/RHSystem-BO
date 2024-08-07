interface ProceedingFileInterface {
  proceedingFileId: number | null
  proceedingFileName: string
  proceedingFilePath: string
  proceedingFileTypeId: number
  proceedingFileExpirationAt: string
  proceedingFileActive: number
  proceedingFileIdentify: string
  proceedingFileCreatedAt: Date | string | null
  proceedingFileUpdatedAt: Date | string | null
  proceedingFileDeletedAt: Date | string | null
}

export type { ProceedingFileInterface }
