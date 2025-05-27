import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"
import type { ShiftExceptionEvidenceInterface } from "../interfaces/ShiftExceptionEvidenceInterface"

export default class ShiftExceptionEvidenceService {
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

  async getFilteredList(searchText: string, page: number = 1, limit: number = 10) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/shift-exception-evidences`, {
      headers,
      query: {
        shiftName: searchText,
        page,
        limit
      },
      onResponse({ response }) {
        responseRequest = response
      },
      onRequestError({ response }) {
        responseRequest = response
      }
    })

    if (responseRequest?.data) {
      return {
        data: responseRequest.data.data,
        meta: responseRequest.data.meta
      }
    }

    return responseRequest
  }

  async delete(shiftExceptionEvidence: ShiftExceptionEvidenceInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;

    await $fetch(`${this.API_PATH}/shift-exception-evidences/${shiftExceptionEvidence.shiftExceptionEvidenceId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    });

    return responseRequest;
  }

  async store(shiftExceptionEvidence: ShiftExceptionEvidenceInterface, file: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    formData.append('file', file)
    for (const key in shiftExceptionEvidence) {
      if (shiftExceptionEvidence.hasOwnProperty(key)) {
        if (shiftExceptionEvidence[key] === undefined || shiftExceptionEvidence[key] === 'null') {
          shiftExceptionEvidence[key] = ''
        }
        formData.append(key, shiftExceptionEvidence[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/shift-exception-evidences`, {
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

  async update(shiftExceptionEvidence: ShiftExceptionEvidenceInterface, file: any | null) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    }
    for (const key in shiftExceptionEvidence) {
      if (shiftExceptionEvidence.hasOwnProperty(key)) {
        if (shiftExceptionEvidence[key] === undefined || shiftExceptionEvidence[key] === 'null') {
          shiftExceptionEvidence[key] = ''
        }
        formData.append(key, shiftExceptionEvidence[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/shift-exception-evidences/${shiftExceptionEvidence.shiftExceptionEvidenceId}`, {
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
}
