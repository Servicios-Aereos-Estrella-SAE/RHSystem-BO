import type { UserInterface } from "../interfaces/UserInterface"

export default class UserService {
  protected API_PATH: string

  constructor () {
    const CONFIG = useRuntimeConfig()
    this.API_PATH = CONFIG.public.BASE_API_PATH
  }


  async getFilteredList (searchText: string, roleId: number | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/users`, {
      query: {
        search: searchText,
        roleId,
        page,
        limit
      },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store (user: UserInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/users`, {
        method: 'POST',
        query: { ...user },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update (user: UserInterface) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/users/${user.userId}`, {
        method: 'PUT',
        query: { ...user },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete (user: UserInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/users/${user.userId}`, {
      method: 'DELETE',
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }



  async show (userId: number) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/users/${userId}`, {
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })
    const user = responseRequest.status === 200 ? responseRequest._data.data.user : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          user: user
        }
      }
    }
  }

  validateSamePass (password: string, passwordConfirm: string) {
    return password === passwordConfirm
  }

  validateInfo(user: UserInterface): boolean {
    if (!user.userEmail) {
      console.error('Wrong email');
      return false;
    }
    if (!user.personId) {
      console.error('Wrong person id');
      return false;
    }
    if (!user.roleId) {
      console.error('Wrong role id');
      return false;
    }
    return true;
  }

  validateEmail(userEmail: string): boolean {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidEmail = emailRegex.test(userEmail)
    if (!isValidEmail) {
      return false
    }
    return true;
  }
}
