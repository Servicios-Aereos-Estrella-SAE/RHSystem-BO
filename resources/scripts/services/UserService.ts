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

  async recovery (userEmail: string) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/auth/recovery`, {
        method: 'POST',
        query: { userEmail: userEmail },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async verifyToken (token: string) {
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/auth/request/verify/${token}`, {
        method: 'POST',
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
      
    }
    return responseRequest
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
}
