import type { ProceedingFileInterface } from "../interfaces/ProceedingFileInterface"

export default class ProceedingFile {
  private proceedingFileId: number | null
  private proceedingFileName: string | null
  private proceedingFilePath: string
  private proceedingFileTypeId: number | null
  private proceedingFileExpirationAt: Date | string | null
  private proceedingFileActive: number
  private proceedingFileObservations: string
  private proceedingFileCreatedAt: Date | string | null
  private proceedingFileUpdatedAt: Date | string | null
  private proceedingFileDeletedAt: Date | string | null

  constructor() {
    this.proceedingFileId = null
    this.proceedingFileName = null
    this.proceedingFilePath = ''
    this.proceedingFileTypeId = null
    this.proceedingFileExpirationAt = null
    this.proceedingFileActive = 1
    this.proceedingFileObservations = ''
    this.proceedingFileCreatedAt = null
    this.proceedingFileUpdatedAt = null
    this.proceedingFileDeletedAt = null
  }

  toModelObject(): ProceedingFileInterface {
    return {
      proceedingFileId: this.proceedingFileId,
      proceedingFileName: this.proceedingFileName,
      proceedingFilePath: this.proceedingFilePath,
      proceedingFileTypeId: this.proceedingFileTypeId,
      proceedingFileExpirationAt: this.proceedingFileExpirationAt,
      proceedingFileActive: this.proceedingFileActive,
      proceedingFileObservations: this.proceedingFileObservations,
      proceedingFileCreatedAt: this.proceedingFileCreatedAt,
      proceedingFileUpdatedAt: this.proceedingFileUpdatedAt,
      proceedingFileDeletedAt: this.proceedingFileDeletedAt
    }
  }
}
