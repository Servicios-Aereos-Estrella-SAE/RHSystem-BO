
import type { EmployeeBankInterface } from "../interfaces/EmployeeBankInterface"
import type { GeneralHeadersInterface } from "../interfaces/GeneralHeadersInterface"

export default class EmployeeBankService {
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


  async store(employeeBank: EmployeeBankInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-banks`, {
        headers,
        method: 'POST',
        body: { ...employeeBank },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async update(employeeBank: EmployeeBankInterface) {
    const headers = { ...this.GENERAL_HEADERS }
    let responseRequest: any = null
    try {
      await $fetch(`${this.API_PATH}/employee-banks/${employeeBank.employeeBankId}`, {
        headers,
        method: 'PUT',
        body: { ...employeeBank },
        onResponse({ response }) { responseRequest = response },
        onRequestError({ response }) { responseRequest = response }
      })
    } catch (error) {
    }
    return responseRequest
  }

  async delete(employeeBank: EmployeeBankInterface) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-banks/${employeeBank.employeeBankId}`, {
      headers,
      method: 'DELETE',
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    return responseRequest
  }

  async show(employeeBankId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employee-banks/${employeeBankId}`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })
    const employeeBank = responseRequest.status === 200 ? responseRequest._data.data : null

    return {
      status: responseRequest.status,
      _data: {
        data: {
          employeeBank: employeeBank
        }
      }
    }
  }

  async getByEmployee(employeeId: number) {
    let responseRequest: any = null
    const headers = { ...this.GENERAL_HEADERS }

    await $fetch(`${this.API_PATH}/employees/${employeeId}/banks`, {
      headers,
      onResponse({ response }) { responseRequest = response },
      onRequestError({ response }) { responseRequest = response }
    })

    const list = responseRequest.status === 200 ? responseRequest._data.data : []
    return list
  }

  validateInfo(employeeBank: EmployeeBankInterface): boolean {
    if (!employeeBank.employeeBankAccountClabe) {
      console.error('Wrong employee bank account clabe');
      return false;
    }
    if (!employeeBank.employeeBankAccountNumber) {
      console.error('Wrong employee bank account number');
      return false;
    }
    if (!employeeBank.employeeBankAccountCurrencyType) {
      console.error('Wrong employee bank account currency type');
      return false;
    }
    if (!employeeBank.employeeId) {
      console.error('Wrong employee id');
      return false;
    }
    if (!employeeBank.bankId) {
      console.error('Wrong bank id');
      return false;
    }
    return true;
  }

  hexToUint8Array(hex: string) {
    if (!hex) {
      throw new Error('Invalid hex string');
    }

    const length = hex.length / 2;
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return array;
  }

  async decrypt(encryptedValue: string, secretKey: string) {
    if (!encryptedValue) {
      throw new Error('Encrypted value is missing');
    }

    // Split the IV and the encrypted value (separated by ':')
    const parts = encryptedValue.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted value format. Expected format: iv:encryptedData');
    }

    const ivHex = parts[0]; // The IV part
    const encryptedHex = parts[1]; // The encrypted data part

    // Convert IV and encrypted data from hex to Uint8Array
    const iv = this.hexToUint8Array(ivHex);
    const encrypted = this.hexToUint8Array(encryptedHex);

    // Convert the secret key to an ArrayBuffer (AES requires a 256-bit key)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);

    // Import the key using the Web Crypto API
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CTR', length: 256 },
      false,
      ['decrypt']
    );

    // Decrypt using the Web Crypto API
    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-CTR',
          counter: iv,
          length: 128, // AES-CTR uses a 128-bit block size for the counter
        },
        key,
        encrypted
      );

      // Convert the decrypted ArrayBuffer to a string
      const decoder = new TextDecoder();
      const decryptedValue = decoder.decode(decryptedBuffer);

      // Return the decrypted value
      return decryptedValue;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null; // Handle decryption failure
    }
  }

  validateAccountCLABE(accountClabe: string) {
    // Verificación de formato: la CLABE debe ser numérica y tener exactamente 18 dígitos
    if (accountClabe.length !== 18 || isNaN(Number(accountClabe))) {
      console.error('The CLABE must have 18 digits and be numeric.')
      return false
    }

    // Los factores para el cálculo del dígito verificador
    const factors = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7]

    let sum = 0

    // Calculamos la suma ponderada de los primeros 17 dígitos
    for (let i = 0; i < 17; i++) {
      const digit = parseInt(accountClabe[i])
      const factor = factors[i]
      const product = digit * factor
      sum += product
    }

    // Cálculo del dígito verificador
    const remainder = sum % 10;
    const checkDigit = remainder === 0 ? 0 : 10 - remainder

    // Obtener el último dígito de la CLABE
    const lastDigit = parseInt(accountClabe[17])

    // Comparamos el dígito verificador calculado con el último dígito de la CLABE
    if (checkDigit === lastDigit) {
      return true
    } else {
      console.error('The CLABE is invalid.');
      return false
    }
  }

  validateAccountNumberMod10(accountNumber: string) {

    // Verificación de formato: la cuenta debe ser numérica y tener exactamente 10 dígitos
    if (accountNumber.length !== 10 || isNaN(parseInt(accountNumber))) {
      console.error('The account number must have exactly 10 digits and be numeric.')
      return false
    }
    // Cálculo del dígito verificador (usando un algoritmo de módulo 10)
    const factors = [3, 1, 3, 1, 3, 1, 3, 1, 3, 1]  // Factores para el algoritmo de módulo 10 (simplificado)
    let sum = 0

    // Sumamos los productos de los dígitos por sus factores
    for (let i = 0; i < 10; i++) { // Iteramos hasta el índice 9 (10 elementos)
      sum += parseInt(accountNumber[i]) * factors[i]
    }

    // Calculamos el dígito verificador
    const remainder = sum % 10
    const checkDigit = remainder === 0 ? 0 : 10 - remainder

    // El último dígito (el dígito verificador) debería coincidir con el cálculo
    if (checkDigit === parseInt(accountNumber[9])) {
      return true
    } else {
      console.error('The account number is invalid.')
      return false
    }
  }
  validateAccountNumberMod11(accountNumber: string) {
    // Verificación de formato: la cuenta debe ser numérica y tener exactamente 10 dígitos
    if (accountNumber.length !== 10 || isNaN(parseInt(accountNumber))) {
      console.error('The account number must have exactly 10 digits and be numeric.')
      return false
    }
    // Cálculo del dígito verificador (suponiendo que se usa un algoritmo de módulo 11)
    const factors = [7, 3, 1, 7, 3, 1, 7, 3, 1, 7]

    let sum = 0

    // Sumamos los productos de los dígitos por sus factores
    for (let i = 0; i < 10; i++) {
      sum += parseInt(accountNumber[i]) * factors[i]
    }
    // Calculamos el dígito verificador
    const remainder = sum % 11
    const checkDigit = remainder === 0 ? 0 : 11 - remainder

    // El último dígito (el dígito verificador) debería coincidir con el cálculo
    if (checkDigit === parseInt(accountNumber[9])) {
      return true
    } else {
      console.error('The account number is invalid.')
      return false
    }
  }

  validCard(accountCardNumber: string) {
    // Remove all non-num characters (e.g., spaces or hyphens)
    const s = accountCardNumber.replace(/[^0-9]/g, '');

    // Check if the input length is valid (most cards have between 13 and 19 nums)
    if (s.length < 13 || s.length > 19) {
      return false;
    }

    let sum = 0;
    let sd = false;

    // Loop through the card number nums, starting from the last num
    for (let i = s.length - 1; i >= 0; i--) {
      let num = parseInt(s[i], 10);

      if (sd) {
        num *= 2;
        if (num > 9) {
          num -= 9; // If the result is a two-num number, subtract 9
        }
      }

      sum += num;
      sd = !sd; // Toggle the doubling
    }

    // If the total sum is divisible by 10, it's a valid card number
    return sum % 10 === 0;
  }

  getIssuer(accountCardNumber: string) {
    // Remove all non-digit characters (e.g., spaces or hyphens)
    const s = accountCardNumber.replace(/[^0-9]/g, '');

    // Check the length of the card number
    if (s.length < 13 || s.length > 19) {
      return 'Invalid card length';
    }

    // Determine the card issuer
    if (/^4/.test(s)) {
      return 'Visa';
    } else if (/^5[1-5]/.test(s)) {
      return 'MasterCard';
    } else if (/^3[47]/.test(s)) {
      return 'American Express';
    } else if (/^6(?:011|5)/.test(s)) {
      return 'Discover';
    } else if (/^3(?:0[0-5]|[68])/.test(s)) {
      return 'Diners Club';
    } else if (/^35/.test(s)) {
      return 'JCB';
    } else {
      return '';
    }
  }
}
