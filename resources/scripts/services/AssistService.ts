import { DateTime } from "luxon"
import type { AssistDayInterface } from "../interfaces/AssistDayInterface"
import type { AssistInterface } from "../interfaces/AssistInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { AssistNoPaymentDatesInterface } from "../interfaces/AssistNoPaymentDatesInterface"
import SystemSettingPayrollConfigService from "./SystemSettingPayrollConfigService"

export default class AssistService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()

    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async index(
    date: string | Date,
    dateEnd: string | Date,
    employeeId: number
  ) {
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }
      const query = { date, 'date-end': dateEnd, employeeId }

      await $fetch(`${this.API_PATH}/v1/assists`, {
        headers,
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }

    return responseRequest
  }

  async sync() {
    let responseRequest: any = null
    const payload = { date: '2024-05-01', page: 1 }
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/v1/assists/synchronize`, {
      headers,
      method: 'POST',
      query: { ...payload },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }

  async syncEmployee(startDate: string | Date, endDate: string | Date, empCode: string) {
    let responseRequest: any = null
    const payload = { startDate, endDate, empCode, page: 1 }
    const headers = { ...this.GENERAL_HEADERS }
    await $fetch(`${this.API_PATH}/v1/assists/employee-synchronize`, {
      method: 'POST',
      headers,
      query: { ...payload },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }

  async getExcelByEmployee(
    date: string | Date,
    dateEnd: string | Date,
    datePay: string | Date,
    employeeId: number,
    reportType: string
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, 'datePay': datePay, employeeId, reportType }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-by-employee`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getExcelByPosition(
    date: string | Date,
    dateEnd: string | Date,
    departmentId: number,
    positionId: number
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, departmentId, positionId }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-by-position`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getExcelByDepartment(
    date: string | Date,
    dateEnd: string | Date,
    datePay: string | Date,
    departmentId: number,
    reportType: string
  ) {
    let responseRequest: any = null
    try {
      const query = { date, 'date-end': dateEnd, 'datePay': datePay, departmentId, reportType }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-by-department`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }


  async getExcelAll(
    date: string | Date,
    dateEnd: string | Date,
    datePay: string | Date,
    reportType: string
  ) {
    let responseRequest: any = null
    try {
      const query = {
        date, 'date-end': dateEnd, 'datePay': datePay, reportType,
      }
      await $fetch(`${this.API_PATH}/v1/assists/get-excel-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...this.GENERAL_HEADERS,
        },
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response?.json() }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async syncStatus() {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/v1/assists/status`, {
      method: 'GET',
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(assist: AssistInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    try {
      await $fetch(`${this.API_PATH}/v1/assists`, {
        method: 'POST',
        headers,
        body: { ...assist },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async inactivate(assistId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/v1/assists/${assistId}/inactivate`, {
        headers,
        method: 'PUT',
        body: { assistId },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getFlatList(
    employeeId: number,
    dateStart: string | Date,
    dateEnd: string | Date
  ) {
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }
      const query = { dateStart, dateEnd, employeeId }

      await $fetch(`${this.API_PATH}/v1/assists/get-flat-list`, {
        headers,
        query,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }

    return responseRequest
  }

  getNoPaymentDates(filters: AssistNoPaymentDatesInterface) {
    const initialYear = DateTime.now().year - 10;
    const filteredDays: Date[] = [];
    if (filters.paymentType === 'biweekly') {
      for (let yearOffset = 0; yearOffset < 20; yearOffset++) {
        const year = initialYear + yearOffset

        for (let month = 1; month <= 12; month++) {
          const date = DateTime.local(year, month)
          if (!date.isValid || typeof date.daysInMonth !== 'number') continue

          for (let day = 1; day <= date.daysInMonth; day++) {
            if (day !== 1 && day !== 15) {
              const date = DateTime.local(year, month, day)
              filteredDays.push(date.toJSDate())
            }
          }
        }
      }

      return filteredDays
    } else if (filters.paymentType === 'specific_day_of_month') {
      const dayToBePaid = filters.dayToBePaid
      if (typeof dayToBePaid !== 'number' || dayToBePaid < 1 || dayToBePaid > 31) {
        return filteredDays
      }

      for (let yearOffset = 0; yearOffset < 20; yearOffset++) {
        const year = initialYear + yearOffset

        for (let month = 1; month <= 12; month++) {
          const date = DateTime.local(year, month)

          if (!date.isValid || typeof date.daysInMonth !== 'number') continue

          const lastDayOfMonth = date.daysInMonth

          const validPayDay = Math.min(dayToBePaid, lastDayOfMonth)

          for (let day = 1; day <= lastDayOfMonth; day++) {
            if (day !== validPayDay) {
              const disabledDate = DateTime.local(year, month, day)
              filteredDays.push(disabledDate.toJSDate())
            }
          }
        }
      }

      return filteredDays
    } else if (filters.paymentType === 'fixed_day_every_n_weeks') {
      if (!filters.dateApplySince || !filters.fixedEveryNWeeksToBePaid) return filteredDays

      const applySince = DateTime.fromISO(filters.dateApplySince).setLocale(filters.localeToUse)
      if (!applySince.isValid) return filteredDays

      const targetDay = filters.fixedDayToBePaid
      const weeksInterval = filters.fixedEveryNWeeksToBePaid

      const systemSettingPayrollConfigService = new SystemSettingPayrollConfigService()
      const dayIndex = systemSettingPayrollConfigService.getDayIndex(targetDay) + 1
      if (dayIndex < 1 || dayIndex > 7) {
        return filteredDays
      }

      const paymentDates: Set<string> = new Set()

      for (let weekOffset = 0; weekOffset <= 52 * 10; weekOffset += weeksInterval) {
        const baseDate = applySince.minus({ weeks: weekOffset })
        const payDate = baseDate.set({ weekday: dayIndex as 1 | 2 | 3 | 4 | 5 | 6 | 7 })
        if (payDate.isValid) {
          paymentDates.add(payDate.toISODate()!)
        }
      }

      for (let weekOffset = 0; weekOffset <= 52 * 20; weekOffset += weeksInterval) {
        const baseDate = applySince.plus({ weeks: weekOffset })
        const payDate = baseDate.set({ weekday: dayIndex as 1 | 2 | 3 | 4 | 5 | 6 | 7 })
        if (payDate.isValid) {
          paymentDates.add(payDate.toISODate()!)
        }
      }

      for (let yearOffset = -10; yearOffset < 20; yearOffset++) {
        const year = applySince.year + yearOffset
        for (let month = 1; month <= 12; month++) {
          const date = DateTime.local(year, month)
          if (!date.isValid || typeof date.daysInMonth !== 'number') continue

          for (let day = 1; day <= date.daysInMonth; day++) {
            const currentDate = DateTime.local(year, month, day).setLocale(filters.localeToUse)
            const isoDate = currentDate.toISODate()
            if (isoDate && !paymentDates.has(isoDate)) {
              filteredDays.push(currentDate.toJSDate())
            }
          }
        }
      }

      return filteredDays

    } else {
      for (let index = 0; index < 20; index++) {
        const currentEvaluatedYear = initialYear + index
        let date = DateTime.local(currentEvaluatedYear, 1, 1)

        while (date.year === currentEvaluatedYear) {
          const isThursday = date.weekday === 4
          const isEvenWeek = date.weekNumber % 2 === 0

          if (!isThursday || (isThursday && !isEvenWeek)) {
            filteredDays.push(date.toJSDate())
          }

          date = date.plus({ days: 1 })
        }
      }

      return filteredDays
    }

  }
}
