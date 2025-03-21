
import type { EmployeeProceedingFileInterface } from "../interfaces/EmployeeProceedingFileInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeProceedingFileService {
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

  async getByEmployee(employeeId: number, fileTypeId?: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/${employeeId}/proceeding-files`, {
      headers,
      query: { type: fileTypeId },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async store(employeeProceedingFile: EmployeeProceedingFileInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees-proceeding-files`, {
        headers,
        method: 'POST',
        body: { ...employeeProceedingFile },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employeeProceedingFile: EmployeeProceedingFileInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees-proceeding-files/${employeeProceedingFile.employeeProceedingFileId}`, {
        headers,
        method: 'PUT',
        body: { ...employeeProceedingFile },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeProceedingFile: EmployeeProceedingFileInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees-proceeding-files/${employeeProceedingFile.employeeProceedingFileId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeProceedingFileId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees-proceeding-files/${employeeProceedingFileId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeProceedingFile = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeProceedingFile: employeeProceedingFile
        }
      }
    }
  }

  validateInfo(employeeProceedingFile: EmployeeProceedingFileInterface): boolean {
    if (!employeeProceedingFile.proceedingFileId) {
      console.error('Wrong proceeding file id');
      return false;
    }
    if (!employeeProceedingFile.employeeId) {
      console.error('Wrong employee id');
      return false;
    }
    return true;
  }

  async getExpiresAndExpiring(dateStart: string, dateEnd: string) {
    const headers = { ...this.GENERAL_HEADERS }
    const query = { 'dateStart': dateStart, 'dateEnd': dateEnd }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees-proceeding-files/get-expired-and-expiring`, {
      headers,
      query: query,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    return responseRequest
  }
}
