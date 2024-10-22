import type { ProceedingFileTypeInterface } from "../interfaces/ProceedingFileTypeInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class ProceedingFileTypeService {
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

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-types`, {
      headers,
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

  async getByArea (areaToUse: string) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-types/by-area/${areaToUse}`, {
      headers,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(proceedingFileType: ProceedingFileTypeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-types`, {
        headers,
        method: 'POST',
        body: proceedingFileType,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(proceedingFileType: ProceedingFileTypeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-types/${proceedingFileType.proceedingFileTypeId}`, {
        headers,
        method: 'PUT',
        body: proceedingFileType,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(proceedingFileTypeId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-types/${proceedingFileTypeId}`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const proceedingFileType = responseRequest.status === 200 ? responseRequest._data.data.proceedingFileType : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              proceedingFileType: proceedingFileType
            }
          }
        }
    } catch (error) {
    }
  }

  async delete(proceedingFileType: ProceedingFileTypeInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/proceeding-file-types/${proceedingFileType.proceedingFileTypeId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  validateInfo(proceedingFileType: ProceedingFileTypeInterface): boolean {
    if (!proceedingFileType.proceedingFileTypeName) {
      console.error('Wrong name');
      return false;
    }
    if (!proceedingFileType.proceedingFileTypeSlug) {
      console.error('Wrong slug');
      return false;
    }
    if (!proceedingFileType.proceedingFileTypeAreaToUse) {
      console.error('Wrong area to use');
      return false;
    }
    return true;
  }
}
