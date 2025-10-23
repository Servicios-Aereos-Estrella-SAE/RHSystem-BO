import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class SupplyTypeService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = { Authorization: `${token.value}` }
  }
  async getAll(page = 1, limit = 10) {
    return await $fetch(`${this.API_PATH}/supply-types`, {
      method: 'GET',
      query: { page, limit },
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getById(id: number) {
    return await $fetch(`${this.API_PATH}/supply-types/${id}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async create(supplyType: SupplyTypeInterface) {
    return await $fetch(`${this.API_PATH}/supply-types`, {
      method: 'POST',
      body: supplyType,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async update(id: number, supplyType: SupplyTypeInterface) {
    return await $fetch(`${this.API_PATH}/supply-types/${id}`, {
      method: 'PUT',
      body: supplyType,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async delete(id: number) {
    return await $fetch(`${this.API_PATH}/supply-types/${id}`, {
      method: 'DELETE',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async search(search: string, page = 1, limit = 10) {
    return await $fetch(`${this.API_PATH}/supply-types`, {
      method: 'GET',
      query: { search, page, limit },
      headers: { ...this.GENERAL_HEADERS }
    })
  }
}
