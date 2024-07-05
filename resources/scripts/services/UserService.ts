
export default class UserService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList (searchText: string, roleId: number | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/users`, {
      query: {
        search: searchText,
        roleId,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
