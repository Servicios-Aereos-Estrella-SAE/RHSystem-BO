import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class BusinessUnitService {
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

  async index() {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/business-units`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}