import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { ProceedingFileTypeEmailInterface } from "../interfaces/ProceedingFileTypeEmailInterface"

export default class ProceedingFileTypeEmailService {
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


  async store(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-emails`, {
        method: 'POST',
        headers,
        query: { ...proceedingFileTypeEmail },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-emails/${proceedingFileTypeEmail.proceedingFileTypeEmailId}`, {
        method: 'PUT',
        headers,
        query: { ...proceedingFileTypeEmail },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/proceeding-file-type-emails/${proceedingFileTypeEmail.proceedingFileTypeEmailId}`, {
      method: 'DELETE',
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(proceedingFileTypeEmailId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/proceeding-file-type-emails/${proceedingFileTypeEmailId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const proceedingFileTypeEmail = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          proceedingFileTypeEmail: proceedingFileTypeEmail
        }
      }
    }
  }

  validateInfo(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface): boolean {
    if (!proceedingFileTypeEmail.proceedingFileTypeEmailEmail) {
      console.error('Wrong proceeding file type email');
      return false;
    }
    if (!proceedingFileTypeEmail.proceedingFileTypeId) {
      console.error('Wrong proceeding file type id');
      return false;
    }
    return true;
  }
}
