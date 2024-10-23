import type { CustomerInterface } from "../interfaces/CustomerInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class CustomerService {
  protected API_PATH: string
  protected GENERAL_HEADERS: GeneralHeadersInterface

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
    const { token } = useAuth()
    this.GENERAL_HEADERS = {
      Authorization: `${token.value}`
    }
  }

  async getFilteredList (searchText: string, page: number = 1, limit: number = 999999999) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    await $fetch(`${this.API_PATH}/customers`, {
      headers,
      query: {
        search: searchText,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(customer: CustomerInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    for (const key in customer) {
      if (customer.hasOwnProperty(key)) {
        if (customer[key] === undefined || customer[key] === 'null') {
          customer[key] = ''
        }
        formData.append(key, customer[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/customers`, {
        headers,
        method: 'POST',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(customer: CustomerInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    const formData = new FormData()
    for (const key in customer) {
      if (customer.hasOwnProperty(key)) {
        if (customer[key] === undefined || customer[key] === 'null') {
          customer[key] = ''
        }
        formData.append(key, customer[key])
      }
    }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/customers/${customer.customerId}`, {
        headers,
        method: 'PUT',
        body: formData,
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async show(id: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/customers/${id}`, {
        headers,
        onResponse ({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const customer = responseRequest.status === 200 ? responseRequest._data.data.customer : null

      return {
          status: responseRequest.status,
          _data: {
            data: {
              customer: customer
            }
          }
        }
    } catch (error) {
    }
  }

  validateCustomerInfo(customer: CustomerInterface): boolean {
    if (!customer.person?.personFirstname) {
      console.error('Wrong first name');
      return false;
    }
    if (!customer.person?.personLastname) {
      console.error('Wrong last name');
      return false;
    }
    if (!customer.person?.personSecondLastname) {
      console.error('Wrong second lastname');
      return false;
    }

    return true;
  }

  async delete(customer: CustomerInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/customers/${customer.customerId}`, {
      headers,
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }
}
