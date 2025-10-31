import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { ProceedingFileTypePropertyInterface } from "../interfaces/ProceedingFileTypePropertyInterface"

export default class ProceedingFileTypePropertyService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface
  constructor() {
    const { token } = useAuth()
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }


  async getFilteredList(searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-type-properties`, {
      headers,
      query: {
        search: searchText,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getCategories(employeeId: number, proceedingFileTypeId: number, proceedingFileId: number | null) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-type-properties/get-categories-by-employee`, {
      headers,
      query: {
        employeeId,
        proceedingFileId,
        proceedingFileTypeId
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(proceedingFileTypeProperty: any) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-properties`, {
        headers,
        method: 'POST',
        body: proceedingFileTypeProperty,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(proceedingFileTypeProperty: ProceedingFileTypePropertyInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-properties/${proceedingFileTypeProperty.proceedingFileTypePropertyId}`, {
        headers,
        method: 'PUT',
        body: proceedingFileTypeProperty,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(proceedingFileTypePropertyId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-type-properties/${proceedingFileTypePropertyId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async getByProceedingFileType(proceedingFileTypeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-type-properties`, {
      headers,
      query: {
        proceedingFileTypeId
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
