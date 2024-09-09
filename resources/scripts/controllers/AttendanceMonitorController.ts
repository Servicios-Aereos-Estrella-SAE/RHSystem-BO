import type { AttendanceMonitorPeriodType } from "../enums/AttendanceMonitorPeriodType"
import { DateTime } from 'luxon'
import DepartmentService from "../services/DepartmentService";
import EmployeeService from "../services/EmployeeService";

export default class AttendanceMonitorController {
  constructor () {

  }

  getDepartmentTotalData (period: keyof typeof AttendanceMonitorPeriodType) {
    const min = 1;
    const max = 100;
    const value = Math.floor(Math.random() * (max - min + 1) + min)

    const serieData = []

    const assist = value
    const tolerance = Math.floor((max - assist) * 0.3)
    const delay = Math.floor(((max - assist) - tolerance) * 0.75)
    const fault = Math.floor(max - assist - tolerance - delay)

    serieData.push({ name: 'Assists', y: assist, color: '#33D4AD' })
    serieData.push({ name: 'Tolerances', y: tolerance, color: '#3CB4E5' })
    serieData.push({ name: 'Delays', y: delay, color: '#FF993A' })
    serieData.push({ name: 'Faults', y: fault, color: '#d45633' })

    return serieData
  }

  getDepartmentPeriodCategories (period: keyof typeof AttendanceMonitorPeriodType, periodDate: Date): string[] {
    switch (period) {
      case 'yearly':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      case 'monthly': {
        const month = parseInt(DateTime.fromJSDate(periodDate).toFormat('LL'))
        const year = parseInt(DateTime.fromJSDate(periodDate).toFormat('yyyy'))
        const date = DateTime.local(year, month, 1)
        const days = date.daysInMonth
        const categories = []

        for (let day = 0; day < (days || 0); day++) {
          categories.push((day + 1).toString())
        }

        return categories
      }
      case 'weekly':
        const date = DateTime.fromJSDate(periodDate)
        const start = date.startOf('week')
        const daysList =[]

        for (let index = 0; index < 7; index++) {
          const currentDay = start.plus({ days: index })
          const year = parseInt(currentDay.toFormat('yyyy'))
          const month = parseInt(currentDay.toFormat('LL'))
          const day = parseInt(currentDay.toFormat('dd'))
          const dayDate = DateTime.local(year, month, day)
          const formatedDay = dayDate.toFormat('DD')
          const daySelected = date.toFormat('yyyy LLL dd') === dayDate.toFormat('yyyy LLL dd')

          if (index === 0) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Monday <br> ${formatedDay}</div>`) }
          if (index === 1) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Tuesday <br> ${formatedDay}</div>`) }
          if (index === 2) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Wednesday <br> ${formatedDay}</div>`) }
          if (index === 3) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Thursday <br> ${formatedDay}</div>`) }
          if (index === 4) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Friday <br> ${formatedDay}</div>`) }
          if (index === 5) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Saturday <br> ${formatedDay}</div>`) }
          if (index === 6) { daysList.push(`<div class="graph-label-attendance-monitor-period ${daySelected ? 'active' : ''}">Sunday <br> ${formatedDay}</div>`) }
        }

        return daysList
      default:
        return []
    }
  }

  getDepartmentPeriodData (period: keyof typeof AttendanceMonitorPeriodType, periodDate: Date) {
    const assists = []
    const tolerances = []
    const delays = []
    const faults = []
    const series = []

    let periodLenght = 12

    switch (period) {
      case 'yearly':
        periodLenght = 12
        break
      case 'monthly': {
        const month = parseInt(DateTime.fromJSDate(periodDate).toFormat('LL'))
        const year = parseInt(DateTime.fromJSDate(periodDate).toFormat('yyyy'))
        const date = DateTime.local(year, month, 1)
        const days = date.daysInMonth
        periodLenght = days || 0
        break
      }
      case 'weekly':
        periodLenght = 7
        break
      default:
        periodLenght = 12
        break
    }

    for (let index = 0; index < periodLenght; index++) {
      const min = 1;
      const max = 100;
      const value = Math.floor(Math.random() * (max - min + 1) + min)

      const assist = value
      const tolerance = Math.floor((max - assist) * 0.3)
      const delay = Math.floor(((max - assist) - tolerance) * 0.75)
      const fault = Math.floor(max - assist - tolerance - delay)

      assists.push(assist)
      tolerances.push(tolerance)
      delays.push(delay)
      faults.push(fault)
    }

    series.push({ name: 'On Time', data: assists, color: '#33D4AD' })
    series.push({ name: 'Tolerances', data: tolerances, color: '#3CB4E5' })
    series.push({ name: 'Delays', data: delays, color: '#FF993A' })
    series.push({ name: 'Faults', data: faults, color: '#d45633' })

    return series
  }

  async getDepartmentPositionEmployees () {
    return []
  }
}
