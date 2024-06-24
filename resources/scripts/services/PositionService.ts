import type { PositionInterface } from "../interfaces/PositionInterface"

export default class PositionService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
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
}
