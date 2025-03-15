import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { ProceedingFileTypePropertyValueInterface } from "../interfaces/ProceedingFileTypePropertyValueInterface"

export default class ProceedingFileTypePropertyValueService {
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

  async store(proceedingFileTypePropertyValue: ProceedingFileTypePropertyValueInterface, file: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    formData.append('proceedingFileTypePropertyValueValueFile', file)
    for (const key in proceedingFileTypePropertyValue) {
      if (proceedingFileTypePropertyValue.hasOwnProperty(key)) {
        if (proceedingFileTypePropertyValue[key] === undefined || proceedingFileTypePropertyValue[key] === 'null') {
          proceedingFileTypePropertyValue[key] = ''
        }
        formData.append(key, proceedingFileTypePropertyValue[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-property-values`, {
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

  async update(proceedingFileTypePropertyValue: ProceedingFileTypePropertyValueInterface, file: any | null) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (file) {
      formData.append('proceedingFileTypePropertyValueValueFile', file)
    }
    for (const key in proceedingFileTypePropertyValue) {
      if (proceedingFileTypePropertyValue.hasOwnProperty(key)) {
        if (proceedingFileTypePropertyValue[key] === undefined || proceedingFileTypePropertyValue[key] === 'null') {
          proceedingFileTypePropertyValue[key] = ''
        }
        formData.append(key, proceedingFileTypePropertyValue[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/proceeding-file-type-property-values/${proceedingFileTypePropertyValue.proceedingFileTypePropertyValueId}`, {
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

  async delete(proceedingFileTypePropertyValue: ProceedingFileTypePropertyValueInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/proceeding-file-type-property-values/${proceedingFileTypePropertyValue.proceedingFileTypePropertyValueId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    });

    return responseRequest;
  }
}
