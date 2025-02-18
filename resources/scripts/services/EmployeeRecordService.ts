import type { EmployeeRecordInterface } from "../interfaces/EmployeeRecordInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeRecordService {
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



  async store(employeeRecord: EmployeeRecordInterface, file: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    formData.append('employeeRecordValueFile', file)
    for (const key in employeeRecord) {
      if (employeeRecord.hasOwnProperty(key)) {
        if (employeeRecord[key] === undefined || employeeRecord[key] === 'null') {
          employeeRecord[key] = ''
        }
        formData.append(key, employeeRecord[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-records`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {

    }
    return responseRequest
  }

  async update(employeeRecord: EmployeeRecordInterface, file: any | null) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (file) {
      formData.append('employeeRecordValueFile', file)
    }
    for (const key in employeeRecord) {
      if (employeeRecord.hasOwnProperty(key)) {
        if (employeeRecord[key] === undefined || employeeRecord[key] === 'null') {
          employeeRecord[key] = ''
        }
        formData.append(key, employeeRecord[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-records/${employeeRecord.employeeRecordId}`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }

    return responseRequest
  }

  async delete(employeeRecord: EmployeeRecordInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/employee-records/${employeeRecord.employeeRecordId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    });

    return responseRequest;
  }
}
