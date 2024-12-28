import type { AircraftOperatorInterface } from '../interfaces/AircraftOperatorInterface'
import type { GeneralHeadersInterface } from '../interfaces/GeneralHeadersInterface'

export default class AircraftOperatorService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor() {
    // Obtener configuración base de tu aplicación (API base path, etc.)
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH

    // Obtener token u otras credenciales (ejemplo con composable `useAuth`)
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`,
    }
  }

  /**
   * Obtiene la lista de Aircraft Operators filtrados y paginados.
   * @param searchText texto de búsqueda (opcional)
   * @param page número de página (por defecto 1)
   * @param limit límite de registros por página (por defecto 999999999)
   */
  async getFilteredList(searchText: string, page = 1, limit = 999999999) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/aircraft-operators`, {
      headers,
      query: {
        search: searchText,
        page,
        limit,
      },
      onResponse({ response }) {
        responseRequest = response
      },
      onRequestError({ response }) {
        responseRequest = response
      },
    })

    return responseRequest
  }

  /**
   * Crea un nuevo Aircraft Operator.
   * Puede manejar subida de imagen si es necesario.
   */
  async store(operator: AircraftOperatorInterface, image: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()

    // Si tienes un campo de imagen (por ejemplo, 'aircraftOperatorImage'), 
    // puedes manejarlo como en el ejemplo con 'photo'.
    if (image) {
      formData.append('photo', image)
    }

    for (const key in operator) {
      if (operator.hasOwnProperty(key)) {
        // Evitar valores 'undefined' o 'null' como strings
        if (operator[key] === undefined || operator[key] === 'null') {
          operator[key] = ''
        }
        formData.append(key, operator[key] as any)
      }
    }

    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/aircraft-operators`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse({ response }) {
          responseRequest = response
        },
        onRequestError({ response }) {
          responseRequest = response
        },
      })
    } catch (error) {
      // Manejo de error si es necesario
    }
    return responseRequest
  }

  /**
   * Actualiza un Aircraft Operator existente por su ID.
   */
  async update(operator: AircraftOperatorInterface, image: any) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()

    if (image) {
      formData.append('photo', image)
    }

    for (const key in operator) {
      if (operator.hasOwnProperty(key)) {
        if (operator[key] === undefined || operator[key] === 'null') {
          operator[key] = ''
        }
        formData.append(key, operator[key] as any)
      }
    }

    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/aircraft-operators/${operator.aircraftOperatorId}`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse({ response }) {
          responseRequest = response
        },
        onRequestError({ response }) {
          responseRequest = response
        },
      })
    } catch (error) {
      // Manejo de error si es necesario
    }
    return responseRequest
  }

  /**
   * Obtiene la información de un Aircraft Operator por ID.
   */
  async show(id: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null

    try {
      await $fetch(`${this.API_PATH}/aircraft-operators/${id}`, {
        headers,
        onResponse({ response }) {
          responseRequest = response
        },
        onRequestError({ response }) {
          responseRequest = response
        },
      })

      // Extrae el objeto operator si la respuesta es 200
      const operator =
        responseRequest.status === 200 ? responseRequest._data.data.operator : null

      return {
        status: responseRequest.status,
        _data: {
          data: {
            operator,
          },
        },
      }
    } catch (error) {
      // Manejo de error si es necesario
    }
  }

  /**
   * Validaciones personalizadas de un AircraftOperator
   * (ejemplo) 
   */
  validateAircraftOperatorInfo(operator: AircraftOperatorInterface): boolean {
    // Ejemplo: validar que tenga un nombre
    if (!operator.aircraftOperatorName) {
      console.error('Missing operator name')
      return false
    }
    // Agrega cualquier otra validación que consideres
    return true
  }

  /**
   * Elimina un Aircraft Operator (SoftDelete o HardDelete, depende del backend).
   */
  async delete(operator: AircraftOperatorInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/aircraft-operators/${operator.aircraftOperatorId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) {
        responseRequest = response
      },
      onRequestError({ response }) {
        responseRequest = response
      },
    })

    return responseRequest
  }
}
