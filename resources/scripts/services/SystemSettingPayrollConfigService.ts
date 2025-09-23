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
    if (!systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid) {
      console.error('Wrong number of days to be paid')
      return false;
    }
    if (!systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset) {
      console.error('Wrong number of over days to offset')
      return false;
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
}
