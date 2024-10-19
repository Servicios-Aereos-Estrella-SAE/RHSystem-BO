interface AssistInterface {
  assistId: number | null
  assistEmpCode: string
  assistPunchTime: string | Date
  assistPunchTimeUtc: string | Date
  assistPunchTimeOrigin: Date | null
  assistTerminalSn: string
  assistTerminalAlias: string
  assistAreaAlias: string
  assistLongitude: string
  assistLatitude: string
  assistUploadTime: string | Date | null
  assistEmpId: number | null
  employeeId: number | null
  assistTerminalId: number | null
  assistAssistSyncId: string
  assistCreatedAt: string | Date | null
  assistUpdatedAt: string | Date | null
}

export type { AssistInterface }
