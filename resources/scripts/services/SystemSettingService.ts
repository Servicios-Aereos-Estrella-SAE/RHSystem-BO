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
}