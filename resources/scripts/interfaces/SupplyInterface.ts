export interface SupplyInterface {
  supplyId: number | null
  supplyFileNumber: number
  supplyName: string
  supplyDescription: string
  supplyTypeId: number
  supplyStatus: string
  supplyDeactivationReason: string | null
  supplyDeactivationDate: Date | null
  supplyCreatedAt: Date | null
  supplyUpdatedAt: Date | null
  deletedAt: Date | null
}
