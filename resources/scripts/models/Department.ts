import type { DepartmentInterface } from "../interfaces/DepartmentInterface"
import type { DepartmentPositionInterface } from "../interfaces/DepartmentPositionInterface"

export default class Department {
  departmentId: number | null
  departmentSyncId: string | null
  departmentCode: string
  departmentName: string
  departmentAlias: string | null
  departmentIsDefault: string
  departmentActive: string
  parentDepartmentId: number | null
  parentDepartmentSyncId: string
  companyId: number | null
  businessUnitId: number | null
  departmentLastSynchronizationAt: Date | string | null
  departmentCreatedAt: Date | string | null
  departmentUpdatedAt: Date | string | null
  departmentDeletedAt: Date | string | null
  subDepartments?: DepartmentInterface[]
  departments?: DepartmentInterface[]
  departmentPositions?: DepartmentPositionInterface[]

  constructor () {
    this.departmentId = null
    this.departmentSyncId = null
    this.departmentCode = ''
    this.departmentName = ''
    this.departmentAlias = null
    this.departmentIsDefault = ''
    this.departmentActive = ''
    this.parentDepartmentId = null
    this.parentDepartmentSyncId = ''
    this.companyId = null
    this.businessUnitId = null
    this.departmentLastSynchronizationAt = null
    this.departmentCreatedAt = null
    this.departmentUpdatedAt = null
    this.departmentDeletedAt = null
    this.subDepartments = []
    this.departments = []
    this.departmentPositions = []

    return {
      departmentId: this.departmentId,
      departmentSyncId: this.departmentSyncId,
      departmentCode: this.departmentCode,
      departmentName: this.departmentName,
      departmentAlias: this.departmentAlias,
      departmentIsDefault: this.departmentIsDefault,
      departmentActive: this.departmentActive,
      parentDepartmentId: this.parentDepartmentId,
      parentDepartmentSyncId: this.parentDepartmentSyncId,
      companyId: this.companyId,
      businessUnitId: this.businessUnitId,
      departmentLastSynchronizationAt: this.departmentLastSynchronizationAt,
      departmentCreatedAt: this.departmentCreatedAt,
      departmentUpdatedAt: this.departmentUpdatedAt,
      departmentDeletedAt: this.departmentDeletedAt,
      subDepartments: this.subDepartments,
      departments: this.departments,
      departmentPositions: this.departmentPositions,
    } as DepartmentInterface
  }
}
