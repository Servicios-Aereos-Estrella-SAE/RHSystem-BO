import { DateTime } from "luxon"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { SystemSettingPayrollConfigInterface } from "../interfaces/SystemSettingPayrollConfigInterface"

export default class SystemSettingPayrollConfigService {
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

  async store(systemSettingPayrollConfig: SystemSettingPayrollConfigInterface) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-setting-payroll-configs`, {
        headers,
        method: 'POST',
        body: systemSettingPayrollConfig,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(systemSettingPayrollConfig: SystemSettingPayrollConfigInterface) {
    const headers = { ...this.GENERAL_HEADERS }

    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-setting-payroll-configs/${systemSettingPayrollConfig.systemSettingPayrollConfigId}`, {
        headers,
        method: 'PUT',
        body: systemSettingPayrollConfig,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(systemSettingPayrollConfigId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/system-setting-payroll-configs/${systemSettingPayrollConfigId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })

      const systemSettingPayrollConfig = responseRequest.status === 200 ? responseRequest._data.data.systemSettingPayrollConfig : null

      return {
        status: responseRequest.status,
        _data: {
          data: {
            systemSettingPayrollConfig: systemSettingPayrollConfig
          }
        }
      }
    } catch (error) {
    }
  }

  async delete(systemSettingPayrollConfig: SystemSettingPayrollConfigInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/system-setting-payroll-configs/${systemSettingPayrollConfig.systemSettingPayrollConfigId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  validateInfo(systemSettingPayrollConfig: SystemSettingPayrollConfigInterface): boolean {
    if (!systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType) {
      console.error('Wrong payment type')
      return false;
    }
    const paymentType = systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType
    if (paymentType === 'fixed_day_every_n_weeks') {
      if (!systemSettingPayrollConfig.systemSettingPayrollConfigFixedDay) {
        console.error('Wrong fixed day')
        return false;
      }
      if (!systemSettingPayrollConfig.systemSettingPayrollConfigFixedEveryNWeeks) {
        console.error('Wrong fixed every n weeks')
        return false;
      }
      if (!systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset) {
        console.error('Wrong number of over days to offset')
        return false;
      }
    } else if (paymentType === 'biweekly' || paymentType === 'specific_day_of_month') {
      if (!systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid) {
        console.error('Wrong number of days to be paid')
        return false;
      }
    }

    if (!systemSettingPayrollConfig.systemSettingPayrollConfigApplySince) {
      console.error('Wrong apply since')
      return false;
    }
    if (!systemSettingPayrollConfig.systemSettingId) {
      console.error('Wrong system setting id')
      return false;
    }

    return true;
  }
  getDayIndex(value: string | null): number {
    if (!value) return -1
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const normalized = value.toLowerCase()
    return days.indexOf(normalized)
  }
  getNextPayDateBiweekly() {
    const today = DateTime.now()

    if (today.day === 1 || today.day === 15) {
      return today.toJSDate()
    }

    if (today.day > 15) {
      let nextPayDate = today.plus({ months: 1 }).set({ day: 1 })
      return nextPayDate.toJSDate()
    }

    let nextPayDate = today.set({ day: 15 })
    return nextPayDate.toJSDate()
  }
  getNextPayDateMonthly(dayToBePaid: number | null) {
    const today = DateTime.now()

    if (typeof dayToBePaid !== 'number' || dayToBePaid < 1 || dayToBePaid > 31) {
      return null
    }

    if (today.day === dayToBePaid) {
      return today.toJSDate()
    }

    if (today.day < dayToBePaid) {
      const possibleDate = today.set({ day: dayToBePaid })
      if (possibleDate.isValid) {
        return possibleDate.toJSDate()
      }
    }

    let nextMonthDate = today.plus({ months: 1 }).set({ day: dayToBePaid })
    if (!nextMonthDate.isValid) {
      nextMonthDate = nextMonthDate.set({ day: nextMonthDate.endOf('month').day });
    }

    return nextMonthDate.toJSDate()
  }
  getNextPayDateWeekDay(fixedEveryNWeeksToBePaid: number | null, dateApplySince: string | null, fixedDayToBePaid: string | null) {
    const today = DateTime.now()
    if (fixedEveryNWeeksToBePaid && dateApplySince) {
      const targetDay = fixedDayToBePaid
      const dayIndex = this.getDayIndex(targetDay) + 1

      const applySince = DateTime.fromJSDate(new Date(dateApplySince))
      let startDate = applySince.set({ weekday: dayIndex as 1 | 2 | 3 | 4 | 5 | 6 | 7 })

      if (startDate < applySince) {
        startDate = startDate.plus({ weeks: 1 })
      }

      while (startDate < today) {
        startDate = startDate.plus({ weeks: fixedEveryNWeeksToBePaid })
      }

      return startDate.toJSDate()
    } else {
      return today.toJSDate()
    }
  }

}
