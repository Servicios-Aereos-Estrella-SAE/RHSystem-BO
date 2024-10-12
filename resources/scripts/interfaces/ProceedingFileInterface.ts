interface ProceedingFileInterface {
  [key: string]: any
  proceedingFileId: number | null
  proceedingFileName: string | null
  proceedingFilePath: string
  proceedingFileTypeId: number | null
  proceedingFileExpirationAt: Date | string | null
  proceedingFileActive: number
  proceedingFileIdentify: string | null
  proceedingFileObservations: string
  proceedingFileAfacRights: string
  proceedingFileSignatureDate: Date | string | null
  proceedingFileEffectiveStartDate: Date | string | null
  proceedingFileEffectiveEndDate: Date | string | null
  proceedingFileInclusionInTheFilesDate: Date | string | null
  proceedingFileOperationCost: number
  proceedingFileCompleteProcess: number
  proceedingFileStatusId: number | null
  proceedingFileCreatedAt: Date | string | null
  proceedingFileUpdatedAt: Date | string | null
  proceedingFileDeletedAt: Date | string | null
}

export type { ProceedingFileInterface }
