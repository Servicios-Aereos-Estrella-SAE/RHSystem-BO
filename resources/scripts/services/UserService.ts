import type { UserInterface } from "../interfaces/UserInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class UserService {
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


  async getFilteredList(searchText: string, roleId: number | null, page: number = 1, limit: number = 999999999) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/users`, {
      headers,
      query: {
        search: searchText,
        roleId,
        page,
        limit
      },
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async store(user: UserInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/users`, {
        headers,
        method: 'POST',
        body: { ...user },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(user: UserInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/users/${user.userId}`, {
        headers,
        method: 'PUT',
        body: { ...user },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(user: UserInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/users/${user.userId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }



  async show(userId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/users/${userId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
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

  async recovery(userEmail: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/auth/recovery`, {
        headers,
        method: 'POST',
        query: { userEmail: userEmail },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async passwordReset(token: string, userPassword: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/auth/password/reset`, {
        headers,
        method: 'POST',
        query: { token: token, userPassword: userPassword },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async verifyToken(token: string) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/auth/request/verify/${token}`, {
        headers,
        method: 'POST',
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {

    }
    return responseRequest
  }


  validateSamePass(password: string, passwordConfirm: string) {
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

  generatePassword() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?'
    const allCharacters = lowercase + uppercase + numbers + specialCharacters
    let password = ''

    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)]
    for (let i = 4; i < 8; i++) {
      password += allCharacters[Math.floor(Math.random() * allCharacters.length)]
    }
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    while (password.length < 8) {
      password += allCharacters[Math.floor(Math.random() * allCharacters.length)]
    }
    return password
  }

  isValidPassword(password: string) {
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialCharacter = /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password)
    const isValidLength = password.length >= 8
    if (hasLowercase && hasUppercase && hasNumber && hasSpecialCharacter && isValidLength) {
      return true
    } else {
      return false
    }
  }

  async hasAccessDepartment(userId: number, departmentId: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/users/has-access-department/${userId}/${departmentId}`, {
        headers,
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
      const userHasAccess = responseRequest.status === 200 ? responseRequest._data.data.userHasAccess : null

      return {
        status: responseRequest.status,
        _data: {
          data: {
            userHasAccess: userHasAccess
          }
        }
      }
    } catch (error) {
    }
  }
}
