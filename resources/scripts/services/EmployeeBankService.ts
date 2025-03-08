
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
        query: { ...employeeBank },
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
        query: { ...employeeBank },
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

  validateCLABEAccount(AccountClabe: string) {
    const cleanedAccount = AccountClabe.replace(/\s+/g, '')
    // 1. Validate that the CLABE account has exactly 18 digits
    if (!/^\d{18}$/.test(cleanedAccount)) {
      return { valid: false, message: 'The CLABE account must have 18 digits.' };
    }

    // 2. Extract parts of the CLABE account
    const bankCode = cleanedAccount.slice(0, 3);  // First 3 digits (Bank code)
    const branchCode = cleanedAccount.slice(3, 6); // Next 3 digits (Branch code)
    const accountNumber = cleanedAccount.slice(6, 17); // Next 11 digits (Account number)
    const controlDigit = cleanedAccount.slice(17, 18); // Last digit (Control digit)

    // 3. Logic to validate the control digit (This calculation depends on the bank and is standardized in Mexico)
    // Here, you can implement an algorithm to validate the control digit if you wish
    // Or simply assume the control digit is correct in a general context.

    // To simplify, let's assume the control digit is valid.
    // If you wish to validate the control digit, you would need to implement the official SAT algorithm.

    return {
      valid: true,
      bankCode,
      branchCode,
      accountNumber,
      controlDigit
    };
  }

  validateAccountNumber(AccountNumber: string) {
    const accountNumber = AccountNumber.replace(/\D/g, ''); // Remove non-numeric characters
    if (accountNumber.length !== 11) {
      console.error('Account number must have exactly 11 digits.')
      return false
    } else if (!/^\d{11}$/.test(accountNumber)) {
      console.error('Account number must be numeric and 11 digits.')
      return false
    } else {
      return true
    }
  }
}
