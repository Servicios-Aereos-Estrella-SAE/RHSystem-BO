import type { SystemSettingsEmployeeInterface } from "../interfaces/SystemSettingsEmployeeInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class SystemSettingsEmployeeService {
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

  async getBySystemSettingId(systemSettingId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/system-settings-employees/${systemSettingId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })

      return responseRequest
    } catch (error) {
      console.error('Error fetching system settings employees:', error)
      return null
    }
  }

  async create(systemSettingId: number, employeeLimit: number | null) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/system-settings-employees`, {
        headers,
        method: 'POST',
        body: {
          systemSettingId,
          employeeLimit
        },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
      console.error('Error creating system settings employee:', error)
    }

    return responseRequest
  }

  async delete(systemSettingId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/system-settings-employees/${systemSettingId}`, {
        headers,
        method: 'DELETE',
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
      console.error('Error deleting system settings employee:', error)
    }

    return responseRequest
  }

  async getActiveLimit(systemSettingId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/system-settings-employees/${systemSettingId}/active`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })

      return responseRequest
    } catch (error) {
      console.error('Error fetching active employee limit:', error)
      return null
    }
  }
}
