import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { AddressInterface } from "../interfaces/AddressInterface"

export default class AddressService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async create(address: AddressInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/address`, {
        headers,
        method: 'POST',
        body: address,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(address: AddressInterface) {
    let responseRequest: any = null
    try {
      const headers = { ...this.GENERAL_HEADERS }

      await $fetch(`${this.API_PATH}/address/${address.addressId}`, {
        headers,
        method: 'PUT',
        body: address,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getPlaces(searchText: string, field: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/address-get-places`, {
      headers,
      query: {
        search: searchText,
        field
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
