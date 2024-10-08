import type { PositionInterface } from "../interfaces/PositionInterface"

export default class PositionService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
    // Función para almacenar una nueva posición
    async store(position: PositionInterface) {
      let responseRequest: any = null;
      try {
        await $fetch(`${this.API_PATH}/positions`, {
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
  
    // Función para actualizar una posición existente
    async update(position: PositionInterface) {
      let responseRequest: any = null;
      try {
        await $fetch(`${this.API_PATH}/positions/${position.positionId}`, {
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

  async assignShift (departmentId: number, positionId: number, shiftId: number, applySince: string) {
    let responseRequest: any = null
    const query = { 'departmentId': departmentId, 'shiftId': shiftId,  'applySince': applySince }
    try {
      await $fetch(`${this.API_PATH}/position/assign-shift/${positionId}`, {
        method: 'POST',
        query: { ...query },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async getPositions (): Promise<PositionInterface[]> {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/positions`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest.status === 200 ? responseRequest._data.data.positions : []
  }
}
