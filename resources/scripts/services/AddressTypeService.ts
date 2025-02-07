
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class AddressTypeService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async getFilteredList(searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    try {
      await $fetch(`${this.API_PATH}/address-types`, {
        headers,
        query: {
          search: searchText,
          page,
          limit
        },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
