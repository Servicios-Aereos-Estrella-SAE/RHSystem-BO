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
        const date = DateTime.local(year, month, 1).setLocale('en')
        const days = date.daysInMonth
        const categories = []

        for (let day = 0; day < (days || 0); day++) {
          const formatedDay = date.plus({ 'days': day }).toFormat('DD')

          categories.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
        }

        return categories
      }
      case 'weekly': {
        const date = DateTime.fromJSDate(periodDate)
        const start = date.startOf('week')
        const daysList =[]

        for (let index = 0; index < 7; index++) {
          const currentDay = start.plus({ days: index })
          const year = parseInt(currentDay.toFormat('yyyy'))
          const month = parseInt(currentDay.toFormat('LL'))
          const day = parseInt(currentDay.toFormat('dd'))
          const dayDate = DateTime.local(year, month, day).setLocale('en')
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
      }
      case 'fourteen': {
        const date = DateTime.fromJSDate(periodDate)
        const start = date.startOf('week').minus({ days: 1 })
        let thursday = start.plus({ days: 3 })
        let startDate = thursday.minus({ days: 24 })
        const daysList =[]

        for (let index = 0; index < 14; index++) {
          const currentDay = startDate.plus({ days: index })
          const year = parseInt(currentDay.toFormat('yyyy'))
          const month = parseInt(currentDay.toFormat('LL'))
          const day = parseInt(currentDay.toFormat('dd'))
          const dayDate = DateTime.local(year, month, day).setLocale('en')
          const formatedDay = dayDate.toFormat('DD')

          daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
        }

        return daysList
      }
      default:
        return []
    }
  }

  getCustomPeriodCategories (periodDate: Date[]): string[] {
    const start = DateTime.fromJSDate(periodDate[0]).setZone('UTC-6')
    const date = DateTime.fromJSDate(periodDate[1]).setZone('UTC-6')
    const periodLenght = Math.floor(date.diff(start, 'days').days) + 1
    const daysList =[]

    for (let index = 0; index < periodLenght; index++) {
      const currentDay = start.plus({ days: index })
      const year = parseInt(currentDay.toFormat('yyyy'))
      const month = parseInt(currentDay.toFormat('LL'))
      const day = parseInt(currentDay.toFormat('dd'))
      const dayDate = DateTime.local(year, month, day).setLocale('en')
      const formatedDay = dayDate.toFormat('DD')

      daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
    }

    return daysList
  }

  getDepartmentPeriodData (period: keyof typeof AttendanceMonitorPeriodType, periodDate: Date, datesSelected: Date[] | null = null) {
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
        const date = DateTime.local(year, month, 1).setLocale('en')
        const days = date.daysInMonth
        periodLenght = days || 0
        break
      }
      case 'weekly':
        periodLenght = 7
        break
      case 'custom':
        if(datesSelected) {
          if (datesSelected.length === 2) {
            const startDate = DateTime.fromJSDate(datesSelected[0])  // Fecha de inicio del rango
            const endDate = DateTime.fromJSDate(datesSelected[1])    // Fecha de fin del rango

            // Calcular el número de días en el rango seleccionado
            periodLenght = Math.floor(endDate.diff(startDate, 'days').days) + 1

            // Establecer el inicio del periodo como la fecha de inicio seleccionada por el usuario
          } else {
            // Si no hay un rango válido seleccionado, establecer el periodo en 0
            periodLenght = 0
          }
        }
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
