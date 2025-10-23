import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class SupplyCharacteristicService {
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

  async getAll(page = 1, limit = 10, supplyTypeId?: number) {
    const query: any = { page, limit }
    if (supplyTypeId) query.supplyTypeId = supplyTypeId

    return await $fetch(`${this.API_PATH}/supplie-characteristics`, {
      method: 'GET',
      query,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getById(id: number) {
    return await $fetch(`${this.API_PATH}/supplie-characteristics/${id}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async create(characteristic: SupplyCharacteristicInterface) {
    return await $fetch(`${this.API_PATH}/supplie-characteristics`, {
      method: 'POST',
      body: characteristic,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async update(id: number, characteristic: SupplyCharacteristicInterface) {
    return await $fetch(`${this.API_PATH}/supplie-characteristics/${id}`, {
      method: 'PUT',
      body: characteristic,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async delete(id: number) {
    return await $fetch(`${this.API_PATH}/supplie-characteristics/${id}`, {
      method: 'DELETE',
      headers: { ...this.GENERAL_HEADERS },
    })
  }
}
