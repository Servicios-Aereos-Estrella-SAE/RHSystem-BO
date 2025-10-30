import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class SupplyService {
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

  async getAll(page = 1, limit = 10, supplyStatus?: string, supplyTypeId?: number, search?: string) {
    const query: any = { page, limit }
    if (supplyStatus) query.supplyStatus = supplyStatus
    if (supplyTypeId) query.supplyTypeId = supplyTypeId
    if (search) query.search = search

    return await $fetch(`${this.API_PATH}/supplies`, {
      method: 'GET',
      query,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getById(id: number) {
    return await $fetch(`${this.API_PATH}/supplies/${id}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getByType(supplyTypeId: number) {
    return await $fetch(`${this.API_PATH}/supplies?supplyTypeId=${supplyTypeId}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getWithTrashed(page = 1, limit = 10) {
    return await $fetch(`${this.API_PATH}/supplies?includeDeleted=true`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async create(supply: SupplyInterface) {
    return await $fetch(`${this.API_PATH}/supplies`, {
      method: 'POST',
      body: supply,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async update(id: number, supply: SupplyInterface) {
    return await $fetch(`${this.API_PATH}/supplies/${id}`, {
      method: 'PUT',
      body: supply,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async delete(id: number) {
    return await $fetch(`${this.API_PATH}/supplies/${id}`, {
      method: 'DELETE',
      headers: { ...this.GENERAL_HEADERS },
    })
  }

  async deactivate(id: number, reason: string, date: string) {
    return await $fetch(`${this.API_PATH}/supplies/${id}/deactivate`, {
      method: 'POST',
      body: {
        supplyDeactivationReason: reason,
        supplyDeactivationDate: date
      },
      headers: { ...this.GENERAL_HEADERS }
    })
  }
}
