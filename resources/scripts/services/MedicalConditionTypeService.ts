import type { MedicalConditionTypeInterface } from "../interfaces/MedicalConditionTypeInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class MedicalConditionTypeService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    const { token } = useAuth()

    this.API_PATH = CONFIG.public.BASE_API_PATH
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getAll() {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/medical-condition-types`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async store(medicalConditionType: MedicalConditionTypeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/medical-condition-types`, {
        headers,
        method: 'POST',
        body: { ...medicalConditionType },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(medicalConditionType: MedicalConditionTypeInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/medical-condition-types/${medicalConditionType.medicalConditionTypeId}`, {
        headers,
        method: 'PUT',
        body: { ...medicalConditionType },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(medicalConditionType: MedicalConditionTypeInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/medical-condition-types/${medicalConditionType.medicalConditionTypeId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(medicalConditionTypeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/medical-condition-types/${medicalConditionTypeId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const medicalConditionType = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          medicalConditionType: medicalConditionType
        }
      }
    }
  }

  validateInfo(medicalConditionType: MedicalConditionTypeInterface): boolean {
    if (!medicalConditionType.medicalConditionTypeName) {
      console.error('Wrong medical condition type name');
      return false;
    }
    return true;
  }
}
