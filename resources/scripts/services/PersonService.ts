export default class PersonService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }
  async getEmployee(id: number) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/person-get-employee/${id}`, {
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const employee = responseRequest.status === 200 ? responseRequest._data.data.employee : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              employee: employee
            }
          }
        }
    } catch (error) {
    }
  }
}
