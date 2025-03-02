import type { EmployeeContractInterface } from "../interfaces/EmployeeContractInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeContractService {
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

  async delete(employeeContract: EmployeeContractInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/employee-contracts/${employeeContract.employeeContractId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    });

    return responseRequest;
  }

  async store(employeeContract: EmployeeContractInterface, file: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    formData.append('employeeContractFile', file)
    for (const key in employeeContract) {
      if (employeeContract.hasOwnProperty(key)) {
        if (employeeContract[key] === undefined || employeeContract[key] === 'null') {
          employeeContract[key] = ''
        }
        formData.append(key, employeeContract[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-contracts`, {
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

  async update(employeeContract: EmployeeContractInterface, file: any | null) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (file) {
      formData.append('employeeContractFile', file)
    }
    for (const key in employeeContract) {
      if (employeeContract.hasOwnProperty(key)) {
        if (employeeContract[key] === undefined || employeeContract[key] === 'null') {
          employeeContract[key] = ''
        }
        formData.append(key, employeeContract[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-contracts/${employeeContract.employeeContractId}`, {
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

  async show(employeeContractId: number) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS };

    await $fetch(`${this.API_PATH}/employee-contracts/${employeeContractId}`, {
      headers,
      onResponse({ response }) {
        responseRequest = response;
      },
      onRequestError({ response }) {
        responseRequest = response;
      },
    });
    const employeeContract =
      responseRequest.status === 200 ? responseRequest._data.data.employeeContract : null;

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeContract: employeeContract,
        },
      },
    };
  }

  async getByEmployee(employeeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/${employeeId}/contracts`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }
}
