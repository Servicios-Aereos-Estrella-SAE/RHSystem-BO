import type { CustomerProceedingFileInterface } from "../interfaces/CustomerProceedingFileInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class CustomerProceedingFileService {
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
  async getByCustomer(customerId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/customers/${customerId}/proceeding-files`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }


  async store (customerProceedingFile: CustomerProceedingFileInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/customers-proceeding-files`, {
        headers,
        method: 'POST',
        query: { ...customerProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (customerProceedingFile: CustomerProceedingFileInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/customers-proceeding-files/${customerProceedingFile.customerProceedingFileId}`, {
        headers,
        method: 'PUT',
        query: { ...customerProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (customerProceedingFile: CustomerProceedingFileInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/customers-proceeding-files/${customerProceedingFile.customerProceedingFileId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (customerProceedingFileId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/customers-proceeding-files/${customerProceedingFileId}`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const customerProceedingFile = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          customerProceedingFile: customerProceedingFile
        }
      }
    }
  }

  validateInfo(customerProceedingFile: CustomerProceedingFileInterface): boolean {
   
    if (!customerProceedingFile.proceedingFileId) {
      console.error('Wrong proceeding file id');
      return false;
    }
    if (!customerProceedingFile.customerId) {
      console.error('Wrong customer id');
      return false;
    }
    return true;
  }

  async getExpiresAndExpiring(dateStart: string, dateEnd: string) {
    const query = { 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/customers-proceeding-files/get-expired-and-expiring`, {
      headers,
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    return responseRequest
  }
}
