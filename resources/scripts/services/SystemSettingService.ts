import type { SystemSettingInterface } from "../interfaces/SystemSettingInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class SystemSettingService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor () {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()

    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/system-settings`, {
      headers,
      query: {
        search: searchText,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(systemSetting: SystemSettingInterface, logo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (logo) {
      formData.append('logo', logo)
    }
    for (const key in systemSetting) {
      if (systemSetting.hasOwnProperty(key)) {
        if (systemSetting[key] === undefined || systemSetting[key] === 'null') {
          systemSetting[key] = ''
        }
        formData.append(key, systemSetting[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-settings`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(systemSetting: SystemSettingInterface, logo: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (logo) {
      formData.append('logo', logo)
    }
    for (const key in systemSetting) {
      if (systemSetting.hasOwnProperty(key)) {
        if (systemSetting[key] === undefined || systemSetting[key] === 'null') {
          systemSetting[key] = ''
        }
        formData.append(key, systemSetting[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-settings/${systemSetting.systemSettingId}`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(id: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-settings/${id}`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const systemSetting = responseRequest.status === 200 ? responseRequest._data.data.systemSetting : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              systemSetting: systemSetting
            }
          }
        }
    } catch (error) {
    }
  }

  async delete(systemSetting: SystemSettingInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/system-settings/${systemSetting.systemSettingId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getActive() {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }
      await $fetch(`${this.API_PATH}/system-settings/get-active`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const systemSetting = responseRequest.status === 200 ? responseRequest._data.data.systemSetting : null

      return systemSetting
    } catch (error) {
    }
  }

  validateSystemSettingInfo(systemSetting: SystemSettingInterface): boolean {
    if (!systemSetting.systemSettingTradeName) {
      console.error('Wrong trade name');
      return false;
    }
    if (!systemSetting.systemSettingSidebarColor) {
      console.error('Wrong sidebar color');
      return false;
    }

    return true;
  }
  async getTolerances() {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      responseRequest = await $fetch(`${this.API_PATH}/tolerances`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    } catch (error) {
      console.error('Error fetching tolerances:', error)
      return null
    }
  }
  async updateTolerance(toleranceId: number, toleranceMinutes: number) {
       const headers = { ...this.GENERAL_HEADERS }
 let responseRequest: any = null
    try {
      responseRequest = await $fetch(`${this.API_PATH}/tolerances/${toleranceId}`, {
        headers,
        method: 'PUT',
        body: {
          tolerance_minutes: toleranceMinutes
        },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
      console.error('Error updating tolerance:', error)
    }
    return responseRequest
  }

  async deleteTolerance(id: null) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    try {
      responseRequest = await $fetch(`${this.API_PATH}/tolerances/${id}`, {
        headers,
        method: 'DELETE', 
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
      console.error(`Error deleting tolerance with ID ${id}`, error)
    }
    return responseRequest
  }
  
}
