import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class SupplyCharacteristicService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface
  constructor() {
    console.log('SupplyCharacteristicService constructor called')
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    console.log('API_PATH from config:', this.API_PATH)

    const { token } = useAuth()
    console.log('Token from useAuth:', token.value)
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
    console.log('Service initialized with headers:', this.GENERAL_HEADERS)
  }

  async getAll(page = 1, limit = 10, supplyTypeId?: number) {
    console.log('SupplyCharacteristicService.getAll called with:', { page, limit, supplyTypeId })
    console.log('API_PATH:', this.API_PATH)
    console.log('GENERAL_HEADERS:', this.GENERAL_HEADERS)

    const query: any = { page, limit }
    if (supplyTypeId) query.supplyTypeId = supplyTypeId

    const url = `${this.API_PATH}/supplie-characteristics`
    console.log('Making request to:', url)
    console.log('Query params:', query)

    return await $fetch(url, {
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
