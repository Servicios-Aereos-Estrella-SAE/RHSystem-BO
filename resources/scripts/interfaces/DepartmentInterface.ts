interface DepartmentInterface {
  department_id: number,
  department_sync_id: string,
  department_code: string,
  department_name: string,
  department_alias: string | null,
  department_is_default: string,
  department_active: string,
  parent_department_id: number | null,
  parent_department_sync_id: string,
  company_id: number | null,
  department_last_synchronization_at: Date | string | null,
  department_created_at: Date | string | null,
  department_updated_at: Date | string | null,
  department_deleted_at: Date | string | null,
}

export type { DepartmentInterface }
