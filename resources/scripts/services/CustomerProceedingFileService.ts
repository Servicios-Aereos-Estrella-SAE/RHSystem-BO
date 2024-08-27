import type { CustomerProceedingFileInterface } from "../interfaces/CustomerProceedingFileInterface"

export default class CustomerProceedingFileService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getByCustomer(customerId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/customers/${customerId}/proceeding-files`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }


  async store (customerProceedingFile: CustomerProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/customers-proceeding-files`, {
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
    try {
      await $fetch(`${this.API_PATH}/customers-proceeding-files/${customerProceedingFile.customerProceedingFileId}`, {
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

    await $fetch(`${this.API_PATH}/customers-proceeding-files/${customerProceedingFile.customerProceedingFileId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (customerProceedingFileId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/customers-proceeding-files/${customerProceedingFileId}`, {
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
}
