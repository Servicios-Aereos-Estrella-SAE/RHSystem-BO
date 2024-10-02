interface ProceedingFileInterface {
  [key: string]: any
  proceedingFileId: number | null
  proceedingFileName: string | null
  proceedingFilePath: string
  proceedingFileTypeId: number | null
  proceedingFileExpirationAt: string | null
  proceedingFileActive: number
  proceedingFileIdentify: string | null
  proceedingFileObservations: string
  proceedingFileAfacRights: string
  proceedingFileSignatureDate: string | null
  proceedingFileEffectiveStartDate: string | null
  proceedingFileEffectiveEndDate: string | null
  proceedingFileInclusionInTheFilesDate: string | null
  proceedingFileOperationCost: number
  proceedingFileCompleteProcess: number
  proceedingFileStatusId: number | null
  proceedingFileCreatedAt: Date | string | null
  proceedingFileUpdatedAt: Date | string | null
  proceedingFileDeletedAt: Date | string | null
}

export type { ProceedingFileInterface }
