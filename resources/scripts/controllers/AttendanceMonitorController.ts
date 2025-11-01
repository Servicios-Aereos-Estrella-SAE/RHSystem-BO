import type { AttendanceMonitorPeriodType } from "../enums/AttendanceMonitorPeriodType"
import { DateTime } from 'luxon'
import type { AssistPeriodCategoriesInterface } from "../interfaces/AssistPeriodCategoriesInterface";
import SystemSettingPayrollConfigService from "../services/SystemSettingPayrollConfigService";

export default class AttendanceMonitorController {

  constructor() {

  }

  getDepartmentTotalData(period: keyof typeof AttendanceMonitorPeriodType) {
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

  getDepartmentPeriodCategories(period: keyof typeof AttendanceMonitorPeriodType, localeToUse: string, filters: AssistPeriodCategoriesInterface): string[] {
    switch (period) {
      case 'yearly':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      case 'monthly': {
        const month = parseInt(DateTime.fromJSDate(filters.periodSelected).toFormat('LL'))
        const year = parseInt(DateTime.fromJSDate(filters.periodSelected).toFormat('yyyy'))
        const date = DateTime.local(year, month, 1).setLocale(localeToUse)
        const days = date.daysInMonth
        const categories = []

        for (let day = 0; day < (days || 0); day++) {
          const formatedDay = date.plus({ 'days': day }).toFormat('DD')

          categories.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
        }

        return categories
      }
      case 'weekly': {
        const date = DateTime.fromJSDate(filters.periodSelected)
        const start = date.startOf('week')
        const daysList = []

        for (let index = 0; index < 7; index++) {
          const currentDay = start.plus({ days: index })
          const year = parseInt(currentDay.toFormat('yyyy'))
          const month = parseInt(currentDay.toFormat('LL'))
          const day = parseInt(currentDay.toFormat('dd'))
          const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
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
      case 'payroll': {
        const daysList = []
        if (filters.paymentType === 'biweekly') {
          const date = DateTime.fromJSDate(filters.periodSelected)
          let startDate, endDate
          if (date.day === 1) {
            const previousMonth = date.minus({ months: 1 })
            startDate = previousMonth.set({ day: 16 })
            endDate = previousMonth.endOf('month')
          } else {
            startDate = date.set({ day: 1 })
            endDate = date.set({ day: 15 })
          }

          let currentDay = startDate

          while (currentDay <= endDate) {
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
            const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
            const formatedDay = dayDate.toFormat('DD')

            daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
            currentDay = currentDay.plus({ days: 1 })
          }
        } else if (filters.paymentType === 'specific_day_of_month') {
          const date = DateTime.fromJSDate(filters.periodSelected)
          const dayToBePaid = filters.dayToBePaid
          if (dayToBePaid && typeof dayToBePaid === 'number' && dayToBePaid > 0 && dayToBePaid <= 31) {
            const previousMonth = date.minus({ months: 1 })

            const startDay = Math.min(dayToBePaid, previousMonth.daysInMonth!)
            const startDate = previousMonth.set({ day: startDay })

            const nextMonth = startDate.plus({ months: 1 })

            const endDay = Math.min(dayToBePaid, nextMonth.daysInMonth!)
            const endDate = nextMonth.set({ day: endDay })

            let currentDay = startDate

            while (currentDay <= endDate) {
              const year = parseInt(currentDay.toFormat('yyyy'))
              const month = parseInt(currentDay.toFormat('LL'))
              const day = parseInt(currentDay.toFormat('dd'))
              const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
              const formatedDay = dayDate.toFormat('DD')

              daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
              currentDay = currentDay.plus({ days: 1 })
            }
          }
        } else if (filters.paymentType === 'fixed_day_every_n_weeks') {
          const targetDay = filters.fixedDayToBePaid
          const systemSettingPayrollConfigService = new SystemSettingPayrollConfigService();
          const dayIndex = systemSettingPayrollConfigService.getDayIndex(targetDay)
          if (targetDay && dayIndex >= 0 && filters.daysToOffset && filters.fixedEveryNWeeksToBePaid) {
            const date = DateTime.fromJSDate(filters.periodSelected)
            const startOfWeek = date.startOf('week')

            let dayWeek = startOfWeek.plus({ days: dayIndex })

            let startDate = dayWeek.minus({ days: filters.daysToOffset })
            for (let index = 0; index < filters.fixedEveryNWeeksToBePaid * 7; index++) {
              const currentDay = startDate.plus({ days: index })
              const year = parseInt(currentDay.toFormat('yyyy'))
              const month = parseInt(currentDay.toFormat('LL'))
              const day = parseInt(currentDay.toFormat('dd'))
              const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
              const formatedDay = dayDate.toFormat('DD')

              daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
            }
          }

        } else if (filters.paymentType === 'fourteenth') {
          if (filters.periodsToOffset && filters.periodSelected) {
            const endDate = DateTime.fromJSDate(filters.periodSelected).startOf('day')
            const paymentDatesLuxon = filters.paymentDates.map(date =>
              DateTime.fromJSDate(date).startOf('day')
            )
            const selectedIndex = paymentDatesLuxon.findIndex(date =>
              date.hasSame(endDate, 'day')
            )
            if (selectedIndex !== -1 && selectedIndex - filters.periodsToOffset >= 0) {
              const startDate = paymentDatesLuxon[selectedIndex - filters.periodsToOffset]

              let currentDay = startDate

              while (currentDay < endDate) {
                const year = parseInt(currentDay.toFormat('yyyy'))
                const month = parseInt(currentDay.toFormat('LL'))
                const day = parseInt(currentDay.toFormat('dd'))
                const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
                const formatedDay = dayDate.toFormat('DD')

                daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)

                currentDay = currentDay.plus({ days: 1 })
              }

            }
          }
        } else {
          const date = DateTime.fromJSDate(filters.periodSelected)
          const start = date.startOf('week').minus({ days: 1 })
          let thursday = start.plus({ days: 3 })
          let startDate = thursday.minus({ days: 24 })


          for (let index = 0; index < 14; index++) {
            const currentDay = startDate.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
            const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
            const formatedDay = dayDate.toFormat('DD')

            daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
          }
        }

        return daysList
      }
      default:
        return []
    }
  }

  getCustomPeriodCategories(periodDate: Date[], localeToUse: string): string[] {
    const start = DateTime.fromJSDate(periodDate[0]).setZone('UTC-6')
    const date = DateTime.fromJSDate(periodDate[1]).setZone('UTC-6')
    const periodLenght = Math.floor(date.diff(start, 'days').days) + 1
    const daysList = []

    for (let index = 0; index < periodLenght; index++) {
      const currentDay = start.plus({ days: index })
      const year = parseInt(currentDay.toFormat('yyyy'))
      const month = parseInt(currentDay.toFormat('LL'))
      const day = parseInt(currentDay.toFormat('dd'))
      const dayDate = DateTime.local(year, month, day).setLocale(localeToUse)
      const formatedDay = dayDate.toFormat('DD')

      daysList.push(`<div class="graph-label-attendance-monitor-period">${formatedDay}</div>`)
    }

    return daysList
  }

  getDepartmentPeriodData(period: keyof typeof AttendanceMonitorPeriodType, periodDate: Date, datesSelected: Date[] | null = null, localeToUse: string) {
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
        const date = DateTime.local(year, month, 1).setLocale(localeToUse)
        const days = date.daysInMonth
        periodLenght = days || 0
        break
      }
      case 'weekly':
        periodLenght = 7
        break
      case 'custom':
        if (datesSelected) {
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

  async getDepartmentPositionEmployees() {
    return []
  }
}
