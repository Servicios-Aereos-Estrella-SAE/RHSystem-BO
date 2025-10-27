import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class EmployeeSupplyService {
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

  async getAll(page = 1, limit = 10, employeeId?: number, employeeSupplyStatus?: string, supplyTypeId?: number) {
    const query: any = { page, limit }
    if (employeeId) query.employeeId = employeeId
    if (employeeSupplyStatus) query.employeeSupplyStatus = employeeSupplyStatus
    if (supplyTypeId) query.supplyTypeId = supplyTypeId

    return await $fetch(`${this.API_PATH}/employee-supplies`, {
      method: 'GET',
      query,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getById(id: number) {
    return await $fetch(`${this.API_PATH}/employee-supplies/${id}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async getActiveByEmployee(employeeId: number) {
    return await $fetch(`${this.API_PATH}/employee-supplies/active-by-employee/${employeeId}`, {
      method: 'GET',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async create(employeeSupply: EmployeeSupplyInterface) {
    return await $fetch(`${this.API_PATH}/employee-supplies`, {
      method: 'POST',
      body: employeeSupply,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async update(id: number, employeeSupply: EmployeeSupplyInterface) {
    return await $fetch(`${this.API_PATH}/employee-supplies/${id}`, {
      method: 'PUT',
      body: employeeSupply,
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async delete(id: number) {
    return await $fetch(`${this.API_PATH}/employee-supplies/${id}`, {
      method: 'DELETE',
      headers: { ...this.GENERAL_HEADERS }
    })
  }

  async retire(id: number, reason: string, date: string) {
    return await $fetch(`${this.API_PATH}/employee-supplies/${id}/retire`, {
      method: 'POST',
      body: {
        employeeSupplyRetirementReason: reason,
        employeeSupplyRetirementDate: date
      },
      headers: { ...this.GENERAL_HEADERS }
    })
  }
}
