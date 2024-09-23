import type { AttendanceMonitorPeriodType } from "../enums/AttendanceMonitorPeriodType";
import type { AttendanceMonitorDateInterface } from "./AttendanceMonitorDateInterface";
import type  { AttendanceMonitorMonthInterface } from "./AttendanceMonitorMonthInterface";
import type { AttendanceMonitorYearInterface } from "./AttendanceMonitorYearInterface";

interface VisualizationModeOptionInterface {
  name: string,
  value: keyof typeof AttendanceMonitorPeriodType,
  calendar_format: AttendanceMonitorMonthInterface | AttendanceMonitorYearInterface | AttendanceMonitorDateInterface,
  selected: boolean,
  number_months: number | null,
}

export type { VisualizationModeOptionInterface as VisualizationModeOptionInterface }