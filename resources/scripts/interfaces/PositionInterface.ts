interface PositionInterface {
  positionId: number,
  positionSyncId: string,
  positionCode: string,
  positionName: string,
  positionAlias: string,
  positionIsDefault: number,
  positionActive: number,
  parentPositionId: number | null,
  parentPositionSyncId: string,
  companyId: number | null,
  positionLastSynchronizationAt: Date | string | null,
  positionCreatedAt: Date | string | null,
  positionUpdatedAt: Date | string | null,
  positionDeletedAt: Date | string | null
}

export type { PositionInterface }
