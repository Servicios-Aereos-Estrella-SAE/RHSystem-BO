
export default class SystemModuleService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/system-modules`, {
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

  async show(systemModuleSlug: string) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/system-modules/${systemModuleSlug}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const systemModule = responseRequest.status === 200 ? responseRequest._data.data.systemModule : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              systemModule: systemModule
            }
          }
        }
    } catch (error) {
    }
  }
}
