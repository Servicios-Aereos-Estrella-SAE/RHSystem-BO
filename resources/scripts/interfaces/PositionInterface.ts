import type { EmployeeInterface } from "./EmployeeInterface"

interface PositionInterface {
  positionId: number
  positionSyncId: string
  positionCode: string
  positionName: any
  positionAlias: string
  positionIsDefault: number
  positionActive: number
  parentPositionId: number | null
  parentPositionSyncId: string
  companyId: number | null
  businessUnitId: number | null
  departmentId: any
  positionLastSynchronizationAt: Date | string | null
  positionCreatedAt: Date | string | null
  positionUpdatedAt: Date | string | null
  positionDeletedAt: Date | string | null
  employees?: EmployeeInterface
  parentPosition?: PositionInterface
  subPositions?: PositionInterface[]
}

export type { PositionInterface }
