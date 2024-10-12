import type { ProceedingFileInterface } from "../interfaces/ProceedingFileInterface"

export default class ProceedingFile {
  private proceedingFileId: number | null
  private proceedingFileName: string | null
  private proceedingFilePath: string
  private proceedingFileTypeId: number | null
  private proceedingFileExpirationAt: Date | string | null
  private proceedingFileActive: number
  private proceedingFileIdentify: string | null
  private proceedingFileObservations: string
  private proceedingFileAfacRights: string
  private proceedingFileSignatureDate: Date | string | null
  private proceedingFileEffectiveStartDate: Date | string | null
  private proceedingFileEffectiveEndDate: Date | string | null
  private proceedingFileInclusionInTheFilesDate: Date | string | null
  private proceedingFileOperationCost: number
  private proceedingFileCompleteProcess: number
  private proceedingFileStatusId: number | null
  private proceedingFileCreatedAt: Date | string | null
  private proceedingFileUpdatedAt: Date | string | null
  private proceedingFileDeletedAt: Date | string | null

  constructor () {
    this.proceedingFileId = null
    this.proceedingFileName = null
    this.proceedingFilePath = ''
    this.proceedingFileTypeId = null
    this.proceedingFileExpirationAt = null
    this.proceedingFileActive = 1
    this.proceedingFileIdentify = null
    this.proceedingFileObservations = ''
    this.proceedingFileAfacRights = ''
    this.proceedingFileSignatureDate = null
    this.proceedingFileEffectiveStartDate = null
    this.proceedingFileEffectiveEndDate = null
    this.proceedingFileInclusionInTheFilesDate = null
    this.proceedingFileOperationCost = 0
    this.proceedingFileCompleteProcess = 0
    this.proceedingFileStatusId = null
    this.proceedingFileCreatedAt = null
    this.proceedingFileUpdatedAt = null
    this.proceedingFileDeletedAt = null
  }

  toModelObject (): ProceedingFileInterface {
    return {
      proceedingFileId: this.proceedingFileId,
      proceedingFileName: this.proceedingFileName,
      proceedingFilePath: this.proceedingFilePath,
      proceedingFileTypeId: this.proceedingFileTypeId,
      proceedingFileExpirationAt: this.proceedingFileExpirationAt,
      proceedingFileActive: this.proceedingFileActive,
      proceedingFileIdentify: this.proceedingFileIdentify,
      proceedingFileObservations: this.proceedingFileObservations,
      proceedingFileAfacRights: this.proceedingFileAfacRights,
      proceedingFileSignatureDate: this.proceedingFileSignatureDate,
      proceedingFileEffectiveStartDate: this.proceedingFileEffectiveStartDate,
      proceedingFileEffectiveEndDate: this.proceedingFileEffectiveEndDate,
      proceedingFileInclusionInTheFilesDate: this.proceedingFileInclusionInTheFilesDate,
      proceedingFileOperationCost: this.proceedingFileOperationCost,
      proceedingFileCompleteProcess: this.proceedingFileCompleteProcess,
      proceedingFileStatusId: this.proceedingFileStatusId,
      proceedingFileCreatedAt: this.proceedingFileCreatedAt,
      proceedingFileUpdatedAt: this.proceedingFileUpdatedAt,
      proceedingFileDeletedAt: this.proceedingFileDeletedAt
    }
  }
}
