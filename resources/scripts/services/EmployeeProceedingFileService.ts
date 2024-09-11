
import type { EmployeeProceedingFileInterface } from "../interfaces/EmployeeProceedingFileInterface"

export default class EmployeeProceedingFileService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getByEmployee(employeeId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees/${employeeId}/proceeding-files`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }


  async store (employeeProceedingFile: EmployeeProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees-proceeding-files`, {
        method: 'POST',
        query: { ...employeeProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (employeeProceedingFile: EmployeeProceedingFileInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employees-proceeding-files/${employeeProceedingFile.employeeProceedingFileId}`, {
        method: 'PUT',
        query: { ...employeeProceedingFile },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (employeeProceedingFile: EmployeeProceedingFileInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees-proceeding-files/${employeeProceedingFile.employeeProceedingFileId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show (employeeProceedingFileId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees-proceeding-files/${employeeProceedingFileId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
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
    const query = { 'dateStart': dateStart,  'dateEnd': dateEnd }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/employees-proceeding-files/get-expired-and-expiring`, {
      query: query,
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    return responseRequest
  }
}
