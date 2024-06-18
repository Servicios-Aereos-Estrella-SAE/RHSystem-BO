interface PositionInterface {
  position_id: number,
  position_sync_id: string,
  position_code: string,
  position_name: string,
  position_alias: string,
  position_is_default: number,
  position_active: number,
  parent_position_id: number | null,
  parent_position_sync_id: string,
  company_id: number | null,
  position_last_synchronization_at: Date | string | null,
  position_created_at: Date | string | null,
  position_updated_at: Date | string | null,
  position_deleted_at: Date | string | null
}

export type { PositionInterface }
