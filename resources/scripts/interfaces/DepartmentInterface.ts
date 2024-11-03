interface DepartmentInterface {
  departmentId: number | null,
  departmentSyncId: string | null,
  departmentCode: string,
  departmentName: string,
  departmentAlias: string | null,
  departmentIsDefault: string,
  departmentActive: string,
  parentDepartmentId: number | null,
  parentDepartmentSyncId: string,
  companyId: number | null,
  businessUnitId: number | null,
  departmentLastSynchronizationAt: Date | string | null,
  departmentCreatedAt: Date | string | null,
  departmentUpdatedAt: Date | string | null,
  departmentDeletedAt: Date | string | null,
  subDepartments?: DepartmentInterface[]
}

export type { DepartmentInterface }
