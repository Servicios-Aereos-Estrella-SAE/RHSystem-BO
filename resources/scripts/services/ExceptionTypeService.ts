
export default class ExceptionTypeService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/exception-types`, {
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
}
