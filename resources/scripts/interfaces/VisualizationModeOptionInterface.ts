import type AttendanceMonitorPeriodCalendarModeType from "../enums/AttendanceMonitorPeriodCalendarModeType";
import type AttendanceMonitorPeriodType from "../enums/AttendanceMonitorPeriodType";
import type AttendanceMonitorMonthInterface from "./AttendanceMonitorMonthInterface";
import type AttendanceMonitorYearInterface from "./AttendanceMonitorYearInterface";

export default interface VisualizationModeOptionInterface {
  name: string,
  value: keyof typeof AttendanceMonitorPeriodType,
  calendar_format: AttendanceMonitorMonthInterface | AttendanceMonitorYearInterface,
  selected: boolean
}
