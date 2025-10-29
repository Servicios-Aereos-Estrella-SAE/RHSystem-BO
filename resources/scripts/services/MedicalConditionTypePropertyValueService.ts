import type { MedicalConditionTypePropertyValueInterface } from "../interfaces/MedicalConditionTypePropertyValueInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class MedicalConditionTypePropertyValueService {
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

    await $fetch(`${this.API_PATH}/medical-condition-type-property-values`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async store(medicalConditionTypePropertyValue: MedicalConditionTypePropertyValueInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/medical-condition-type-property-values`, {
        headers,
        method: 'POST',
        body: { ...medicalConditionTypePropertyValue },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(medicalConditionTypePropertyValue: MedicalConditionTypePropertyValueInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/medical-condition-type-property-values/${medicalConditionTypePropertyValue.medicalConditionTypePropertyValueId}`, {
        headers,
        method: 'PUT',
        body: { ...medicalConditionTypePropertyValue },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(medicalConditionTypePropertyValue: MedicalConditionTypePropertyValueInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/medical-condition-type-property-values/${medicalConditionTypePropertyValue.medicalConditionTypePropertyValueId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(medicalConditionTypePropertyValueId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/medical-condition-type-property-values/${medicalConditionTypePropertyValueId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const medicalConditionTypePropertyValue = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          medicalConditionTypePropertyValue: medicalConditionTypePropertyValue
        }
      }
    }
  }

  validateInfo(medicalConditionTypePropertyValue: MedicalConditionTypePropertyValueInterface): boolean {
    if (!medicalConditionTypePropertyValue.medicalConditionTypePropertyId) {
      console.error('Wrong medical condition type property id');
      return false;
    }
    if (!medicalConditionTypePropertyValue.medicalConditionTypePropertyValue) {
      console.error('Wrong medical condition type property value');
      return false;
    }
    return true;
  }
}
