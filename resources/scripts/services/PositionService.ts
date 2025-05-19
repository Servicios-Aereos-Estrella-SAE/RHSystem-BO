import type { PositionInterface } from "../interfaces/PositionInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class PositionService {
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

  async store(position: PositionInterface) {
    let responseRequest: any = null;
    const headers = { ...this.GENERAL_HEADERS }

    try {
      await $fetch(`${this.API_PATH}/positions`, {
        headers,
        method: 'POST',
        body: position,
        onResponse({ response }) {
          responseRequest = response;
        },
        onRequestError({ response }) {
          responseRequest = response;
        }
      });
    } catch (error) {
      console.error("Error al crear la posición:", error);
    }
    return responseRequest;
  }

  async update(position: PositionInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null;
    try {
      await $fetch(`${this.API_PATH}/positions/${position.positionId}`, {
        headers,
        method: 'PUT',
        body: position,
        onResponse({ response }) {
          responseRequest = response;
        },
        onRequestError({ response }) {
          responseRequest = response;
        }
      });
    } catch (error) {
      console.error("Error al actualizar la posición:", error);
    }
    return responseRequest;
  }

  async getPositionsDepartment(departmentId: number): Promise<PositionInterface[]> {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }
    try {
      await $fetch(`${this.API_PATH}/departments/${departmentId}/positions`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })

      const list = responseRequest.status === 200 ? responseRequest._data.data.positions : []
      // map list and set to position inteface object item.position
      return list.map((item: any) => item.position)
    } catch (error) {
    }
    return []
  }

  async show(positionId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/positions/${positionId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async assignShift(departmentId: number, positionId: number, shiftId: number, applySince: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    const query = { 'departmentId': departmentId, 'shiftId': shiftId, 'applySince': applySince }
    try {
      await $fetch(`${this.API_PATH}/position/assign-shift/${positionId}`, {
        headers,
        method: 'POST',
        query: { ...query },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getPositions(): Promise<PositionInterface[]> {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/positions`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest.status === 200 ? responseRequest._data.data.positions : []
  }
}

