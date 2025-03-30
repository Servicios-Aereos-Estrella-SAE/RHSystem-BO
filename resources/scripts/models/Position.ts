import type { EmployeeInterface } from '../interfaces/EmployeeInterface'
import type { PositionInterface } from '../interfaces/PositionInterface'

export default class Position {
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

  constructor () {
    this.positionId = null
    this.positionSyncId = ''
    this.positionCode = ''
    this.positionName = ''
    this.positionAlias = ''
    this.positionIsDefault = 0
    this.positionActive = 1
    this.parentPositionId = null
    this.parentPositionSyncId = ''
    this.companyId = null
    this.businessUnitId = null
    this.departmentId = null
    this.positionLastSynchronizationAt = null
    this.positionCreatedAt = null
    this.positionUpdatedAt = null
    this.positionDeletedAt = null
    this.employees = []
    this.parentPosition = null
    this.subPositions = []
    this.positions = []

    return {
      positionId: this.positionId,
      positionSyncId: this.positionSyncId,
      positionCode: this.positionCode,
      positionName: this.positionName,
      positionAlias: this.positionAlias,
      positionIsDefault: this.positionIsDefault,
      positionActive: this.positionActive,
      parentPositionId: this.parentPositionId,
      parentPositionSyncId: this.parentPositionSyncId,
      companyId: this.companyId,
      businessUnitId: this.businessUnitId,
      departmentId: this.departmentId,
      positionLastSynchronizationAt: this.positionLastSynchronizationAt,
      positionCreatedAt: this.positionCreatedAt,
      positionUpdatedAt: this.positionUpdatedAt,
      positionDeletedAt: this.positionDeletedAt,
      employees: this.employees,
      parentPosition: this.parentPosition,
      subPositions: this.subPositions,
      positions: this.positions,
    } as PositionInterface
  }
}

export type { PositionInterface }
