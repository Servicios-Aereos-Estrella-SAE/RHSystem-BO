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

    await $fetch(`${this.API_PATH}/users`, {
      method: 'POST',
      query: { ...user },
      onResponse ({ response }) { responseRequest = response },
      onRequestError ({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async update (user: UserInterface) {
    let responseRequest: any = null

    await $fetch(`${this.API_PATH}/users/${user.userId}`, {
      method: 'PUT',
      query: { ...user },
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

  validateStrongPass (password: string, passwordConfirm: string) {
    if (!password) {
       return false
     }
    /**
    //  * Entre 6 y 40 caracteres
    //  * Al menos una minuscula
    //  * Al menos una mayuscula
    //  * Al menos un numero
    //  * Al menos un caracter especial
    //  */
    const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,40}$/
    return !!password.match(regEx)
  }

  validateSamePass (password: string, passwordConfirm: string) {
    return password === passwordConfirm
  }

  validateInfo(user: UserInterface): boolean {
    if (!user.userEmail) {
      console.error('Invalid email');
      return false;
    }
    if (!user.personId) {
      console.error('Invalid person id');
      return false;
    }
    if (!user.roleId) {
      console.error('Invalid role id');
      return false;
    }
    return true;
  }
}
