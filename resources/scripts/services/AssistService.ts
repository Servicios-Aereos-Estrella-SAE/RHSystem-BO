export default class AssistService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }

  async index (
    date: string | Date,
    dateEnd: string | Date,
    employee: number,
    page: number = 1,
    limit: number = 999999999
  ) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/v1/assists`, {
      query: {
        date,
        'date-end': dateEnd,
        employee,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
