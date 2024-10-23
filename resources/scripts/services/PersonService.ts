import type { PeopleInterface } from "../interfaces/PeopleInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class PersonService {
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
  async getEmployee(id: number) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/person-get-employee/${id}`, {
        headers,
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

  async store(person: PeopleInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/persons`, {
        headers,
        method: 'POST',
        query: { ...person },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(person: PeopleInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/persons/${person.personId}`, {
        headers,
        method: 'PUT',
        query: { ...person },
        onResponse ({ response }) { responseRequest = response },
        onRequestError ({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  isValidRFC(rfc: string, aceptarGenerico: Boolean = true) {
    if (!rfc) { return false }
  
    const re = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/
    const validado = rfc.match(re)
    if (!validado) { return false }
  
    // Separar el dígito verificador del resto del RFC
    const digitoVerificador = `${validado.pop()}`
    const rfcSinDigito = validado.slice(1).join('')
    const len = rfcSinDigito.length
  
    // Obtener el digito esperado
    const diccionario = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ'
    const indice = len + 1
    let suma,
      digitoEsperado
  
    if (len === 12) { suma = 0 } else { suma = 481 } // Ajuste para persona moral
  
    for (let i = 0; i < len; i++) { suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i) }
    digitoEsperado = 11 - suma % 11
    if (digitoEsperado === 11) { digitoEsperado = 0 } else if (digitoEsperado === 10) { digitoEsperado = 'A' }
    digitoEsperado = `${digitoEsperado}`
  
    // El dígito verificador coincide con el esperado?
    // o es un RFC Genérico (ventas a público general)?
    if ((digitoVerificador !== digitoEsperado) && (!aceptarGenerico || rfcSinDigito + digitoVerificador !== 'XAXX010101000')) {
      return false
    } else if (!aceptarGenerico && (rfcSinDigito + digitoVerificador === 'XEXX010101000')) {
      return false
    }
    return true
  }

  isValidCURP(curp: string) {
    if (!curp) { return false }
  
    const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
    const valid = curp.match(re)
  
    // Coincide con el formato general?
    if (!valid) { return false }
  
    // Validar que coincida el dígito verificador
    if (`${valid[2]}` !== `${this.validateVerifiedDigitCURP(valid[1])}`) { return false }
    return true // Validado
  }
  
  private validateVerifiedDigitCURP (curp17: string) {
    const diccionario = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'
    let lngSuma = 0.0
    let lngDigito = 0.0
    for (let i = 0; i < 17; i++) { lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i) }
    lngDigito = 10 - lngSuma % 10
    if (lngDigito === 10) { return 0 }
    return lngDigito
  }
}
