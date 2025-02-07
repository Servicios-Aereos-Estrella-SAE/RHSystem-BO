import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { EmployeeAddressInterface } from "../interfaces/EmployeeAddressInterface"

export default class EmployeeAddressService {
    protected API_PATH: string
    protected GENERAL_HEADERS: GeneralHeadersInterface

    constructor () {
      const CONFIG = useRuntimeConfig()
      this.API_PATH = CONFIG.public.BASE_API_PATH
      const { token } = useAuth()
      this.GENERAL_HEADERS = {
        Authorization: `${token.value}`
      }
    }

    async create(employeeAddress: EmployeeAddressInterface) {
      const headers = { ...this.GENERAL_HEADERS }
      let responseRequest: any = null
      await $fetch(`${this.API_PATH}/employee-address`, {
        headers,
        method: 'POST',
        body: employeeAddress,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      return responseRequest
    }
  
  }
  