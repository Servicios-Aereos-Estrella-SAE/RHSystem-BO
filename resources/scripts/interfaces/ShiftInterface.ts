interface ShiftInterface {
  shift_id: number | null
  shift_name: string
  shift_day_start: Date | string
  shift_time_start: number
  shift_active_hours: number
  shift_rest_days: string
  shift_created_at: Date | string | null
  shift_updated_at: Date | string | null
  shift_deleted_at: Date | string | null
}

export type { ShiftInterface }
