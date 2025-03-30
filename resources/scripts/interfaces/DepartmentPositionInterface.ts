import type { DateTime } from "luxon"
import type { PositionInterface } from "./PositionInterface"

interface DepartmentPositionInterface {
  departmentPositionId: number | null
  departmentId: number
  positionId: number
  departmentPositionLastSynchronizationAt: Date
  departmentPositionCreatedAt: DateTime | null
  departmentPositionUpdatedAt: DateTime | null
  departmentPositionDeletedAt: DateTime | null
  position?: PositionInterface
}

export type { DepartmentPositionInterface }
