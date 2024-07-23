import type { PositionInterface } from "../interfaces/PositionInterface"

export default class PositionService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getPositionsDepartment(departmentId: number): Promise<PositionInterface[]> {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/departments/${departmentId}/positions`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data.positions : []
    // map list and set to position inteface object item.position
    return list.map((item: any) => item.position)
  }

  async show (departmentId: number, positionId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/departments/${departmentId}/positions`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data.positions : []
    const position = list.find((item: PositionInterface) => item.positionId === positionId)

    return {
      status: responseRequest.status,
      _data: {
        data: {
          position: position.position
        }
      }
    }
  }

  async assignShift (departmentId: number, positionId: number, shiftId: number, employeShiftsApplySince: string) {
    let responseRequest: any = null
    const query = { 'departmentId': departmentId, 'shiftId': shiftId,  'employeShiftsApplySince': employeShiftsApplySince }
    try {
      await $fetch(`${this.API_PATH}/positions-assign-shift/${positionId}`, {
        method: 'POST',
        query: { ...query },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }
}
