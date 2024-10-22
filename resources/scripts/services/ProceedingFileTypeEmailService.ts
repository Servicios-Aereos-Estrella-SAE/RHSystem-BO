import type { ProceedingFileTypeEmailInterface } from "../interfaces/ProceedingFileTypeEmailInterface"

export default class ProceedingFileTypeEmailService {
  protected API_PATH: string

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }


  async store(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-emails`, {
        method: 'POST',
        query: { ...proceedingFileTypeEmail },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-emails/${proceedingFileTypeEmail.proceedingFileTypeEmailId}`, {
        method: 'PUT',
        query: { ...proceedingFileTypeEmail },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/proceeding-file-type-emails/${proceedingFileTypeEmail.proceedingFileTypeEmailId}`, {
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(proceedingFileTypeEmailId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/proceeding-file-type-emails/${proceedingFileTypeEmailId}`, {
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
