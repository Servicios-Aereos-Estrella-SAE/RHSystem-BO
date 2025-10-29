import type { MedicalConditionTypePropertyInterface } from "../interfaces/MedicalConditionTypeInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class MedicalConditionTypePropertyService {
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

    await $fetch(`${this.API_PATH}/medical-condition-type-properties`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  async store(medicalConditionTypeProperty: MedicalConditionTypePropertyInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/medical-condition-type-properties`, {
        headers,
        method: 'POST',
        body: { ...medicalConditionTypeProperty },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(medicalConditionTypeProperty: MedicalConditionTypePropertyInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/medical-condition-type-properties/${medicalConditionTypeProperty.medicalConditionTypePropertyId}`, {
        headers,
        method: 'PUT',
        body: { ...medicalConditionTypeProperty },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(medicalConditionTypeProperty: MedicalConditionTypePropertyInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/medical-condition-type-properties/${medicalConditionTypeProperty.medicalConditionTypePropertyId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(medicalConditionTypePropertyId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/medical-condition-type-properties/type/${medicalConditionTypePropertyId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const medicalConditionTypeProperty = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          medicalConditionTypeProperty: medicalConditionTypeProperty
        }
      }
    }
  }

  validateInfo(medicalConditionTypeProperty: MedicalConditionTypePropertyInterface): boolean {
    if (!medicalConditionTypeProperty.medicalConditionTypePropertyName) {
      console.error('Wrong medical condition type property name');
      return false;
    }
    if (!medicalConditionTypeProperty.medicalConditionTypeId) {
      console.error('Wrong medical condition type id');
      return false;
    }
    return true;
  }
}
