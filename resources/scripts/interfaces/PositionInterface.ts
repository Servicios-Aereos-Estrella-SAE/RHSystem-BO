import type { EmployeeInterface } from "./EmployeeInterface"

interface PositionInterface {
  positionId: number | null
  positionSyncId: string
  positionCode: string
  positionName: string
  positionAlias: string
  positionIsDefault: number
  positionActive: number
  parentPositionId: number | null
  parentPositionSyncId: string
  companyId: number | null
  businessUnitId: number | null
  departmentId: number | null
  positionLastSynchronizationAt: Date | string | null
  positionCreatedAt: Date | string | null
  positionUpdatedAt: Date | string | null
  positionDeletedAt: Date | string | null
  employees?: EmployeeInterface[]
  parentPosition: PositionInterface | null
  subPositions?: PositionInterface[]
  positions?: PositionInterface[]
}

export type { PositionInterface }
