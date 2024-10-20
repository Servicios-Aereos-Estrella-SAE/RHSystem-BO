import type { SystemSettingInterface } from "../interfaces/SystemSettingInterface"

export default class SystemSettingService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/system-settings`, {
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
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-settings/${id}`, {
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

    await $fetch(`${this.API_PATH}/system-settings/${systemSetting.systemSettingId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getActive() {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-settings/get-active`, {
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
    let responseRequest: any = null
    try {
      responseRequest = await $fetch(`${this.API_PATH}/tolerances`, {
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
    let responseRequest: any = null
    try {
      responseRequest = await $fetch(`${this.API_PATH}/tolerances/${toleranceId}`, {
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
    try {
      responseRequest = await $fetch(`${this.API_PATH}/tolerances/${id}`, {
        method: 'DELETE', 
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
      console.error(`Error deleting tolerance with ID ${id}`, error)
    }
    return responseRequest
  }


  async assignSystemModules(systemSettingId: number, systemModules: Array<any>) {
    let responseRequest: any = null
    const formData = new FormData()
    systemModules.forEach((systemModuleId) => {
      formData.append('systemModules[]', systemModuleId);
    })
    try {
      await $fetch(`${this.API_PATH}/system-settings/assign-system-modules/${systemSettingId}`, {
        method: 'POST',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
  
}
