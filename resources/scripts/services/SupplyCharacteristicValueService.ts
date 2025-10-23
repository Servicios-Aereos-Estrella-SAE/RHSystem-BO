import type { SupplyCharacteristicValueInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicValueInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class SupplyCharacteristicValueService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface
  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getAll(page = 1, limit = 10, supplieCaracteristicId?: number) {
    const query: any = { page, limit }
    if (supplieCaracteristicId) query.supplieCaracteristicId = supplieCaracteristicId
    return await $fetch(`${this.API_PATH}/supplie-characteristic-values`, {
      method: 'GET',
      query,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getById(id: number) {
    return await $fetch(`${this.API_PATH}/supplie-characteristic-values/${id}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getBySupply(supplyId: number) {
    return await $fetch(`${this.API_PATH}/supplie-characteristic-values/by-supply/${supplyId}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async create(characteristicValue: SupplyCharacteristicValueInterface) {
    return await $fetch(`${this.API_PATH}/supplie-characteristic-values`, {
      method: 'POST',
      body: characteristicValue,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async update(id: number, characteristicValue: SupplyCharacteristicValueInterface) {
    return await $fetch(`${this.API_PATH}/supplie-characteristic-values/${id}`, {
      method: 'PUT',
      body: characteristicValue,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async delete(id: number) {
    return await $fetch(`${this.API_PATH}/supplie-characteristic-values/${id}`, {
      method: 'DELETE',
      headers: { ...this.GENERAL_HEADERS },
    })
  }
}
