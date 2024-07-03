import type { AssistInterface } from "../interfaces/AssistInterface"

export default class AssistModel {
  private assistId: number | null
  private assistEmpCode: string
  private assistPunchTime: string | Date
  private assistPunchTimeUtc: string | Date
  private assistPunchTimeOrigin: Date | null
  private assistTerminalSn: string
  private assistTerminalAlias: string
  private assistAreaAlias: string
  private assistLongitude: string
  private assistLatitude: string
  private assistUploadTime: string | Date | null
  private assistEmpId: number | null
  private assistTerminalId: number | null
  private assistAssistSyncId: string
  private assistCreatedAt: string | Date | null
  private assistUpdatedAt: string | Date | null

  constructor () {
    this.assistId = null
    this.assistEmpCode = ''
    this.assistPunchTime = ''
    this.assistPunchTimeUtc = ''
    this.assistPunchTimeOrigin = null
    this.assistTerminalSn = ''
    this.assistTerminalAlias = ''
    this.assistAreaAlias = ''
    this.assistLongitude = ''
    this.assistLatitude = ''
    this.assistUploadTime = ''
    this.assistEmpId = null
    this.assistTerminalId = null
    this.assistAssistSyncId = ''
    this.assistCreatedAt = ''
    this.assistUpdatedAt = ''
  }

  toModelObject (): AssistInterface {
    return {
      assistId: this.assistId,
      assistEmpCode: this.assistEmpCode,
      assistPunchTime: this.assistPunchTime,
      assistPunchTimeUtc: this.assistPunchTimeUtc,
      assistPunchTimeOrigin: this.assistPunchTimeOrigin,
      assistTerminalSn: this.assistTerminalSn,
      assistTerminalAlias: this.assistTerminalAlias,
      assistAreaAlias: this.assistAreaAlias,
      assistLongitude: this.assistLongitude,
      assistLatitude: this.assistLatitude,
      assistUploadTime: this.assistUploadTime,
      assistEmpId: this.assistEmpId,
      assistTerminalId: this.assistTerminalId,
      assistAssistSyncId: this.assistAssistSyncId,
      assistCreatedAt: this.assistCreatedAt,
      assistUpdatedAt: this.assistUpdatedAt,
    }
  }
}
