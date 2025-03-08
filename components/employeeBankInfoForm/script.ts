import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { EmployeeBankInterface } from '~/resources/scripts/interfaces/EmployeeBankInterface';
import EmployeeBankService from '~/resources/scripts/services/EmployeeBankService';
import { DateTime } from 'luxon';
import type { BankInterface } from '~/resources/scripts/interfaces/BankInterface';
import BankService from '~/resources/scripts/services/BankService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeeBankInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    employeeBank: { type: Object as PropType<EmployeeBankInterface>, required: true },
    clickOnSave: { type: Function, default: null }
  },
  data: () => ({
    banksList: [] as BankInterface[],
    submitted: false,
    isNewEmployeeBank: false,
    isReady: false,
    isDeleted: false,
    currencyOptions: [
      { label: 'MXN', value: 'MXN' },
      { label: 'USD', value: 'USD' },
    ],
    startDate: '' as string,
    displayStartDateCalendar: false as boolean,
    endDate: '' as string,
    displayEndDateCalendar: false as boolean,
    isBankPermanent: false,
    isValidAccountClabe: false,
    isValidAccountNumber: false
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewEmployeeBank = !this.employeeBank.employeeBankId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    if (this.employeeBank.employeeBankId) {

      const employeeBankService = new EmployeeBankService()
      if (this.employeeBank.employeeBankAccountClabe) {
        const valueDecrypt = await employeeBankService.decrypt(this.employeeBank.employeeBankAccountClabe, this.$config.public.APP_ENCRYPT_KEY)
        this.employeeBank.employeeBankAccountClabe = valueDecrypt ? valueDecrypt : null
        //this.formatAccountClabe()
      }
      if (this.employeeBank.employeeBankAccountNumber) {
        const valueDecrypt = await employeeBankService.decrypt(this.employeeBank.employeeBankAccountNumber, this.$config.public.APP_ENCRYPT_KEY)
        this.employeeBank.employeeBankAccountNumber = valueDecrypt ? valueDecrypt : null
        //this.formatAccountNumber()
      }
    }
    this.banksList = await this.getBanks()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    getDate(date: string | Date) {
      if (!date) {
        return ''
      }
      if (typeof date === 'string' && !date.includes('T')) {
        date = new Date(date)
      }
      const dateEmployeeBank = DateTime.fromJSDate(new Date(date), { zone: 'utc' })
      return dateEmployeeBank.setLocale('en').toFormat('DDDD')
    },
    async getBanks() {
      const response = await new BankService().getFilteredList('', 1, 999999)
      const list: BankInterface[] = response.status === 200 ? response._data.data.banks.data : []
      return list
    },
    async onSave() {
      this.submitted = true
      this.isValidAccountClabe = true
      this.isValidAccountNumber = true
      const employeeBankService = new EmployeeBankService()
      if (!this.employeeBank.bankId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.employeeBank.employeeBankAccountClabe) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      this.isValidAccountClabe = employeeBankService.validateCLABEAccount(this.employeeBank.employeeBankAccountClabe).valid
      if (!this.isValidAccountClabe) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Account clabe not valid',
          life: 5000,
        })
        return
      }
      if (!this.employeeBank.employeeBankAccountNumber) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      this.isValidAccountNumber = employeeBankService.validateAccountNumber(this.employeeBank.employeeBankAccountNumber)
      if (!this.isValidAccountNumber) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Account clabe not valid',
          life: 5000,
        })
        return
      }
      if (!this.employeeBank.employeeBankAccountCurrencyType) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let employeeBankResponse = null
      if (!this.employeeBank.employeeBankId) {
        employeeBankResponse = await employeeBankService.store(this.employeeBank)
      } else {
        employeeBankResponse = await employeeBankService.update(this.employeeBank)
      }

      if (employeeBankResponse.status === 201 || employeeBankResponse.status === 200) {
        employeeBankResponse = await employeeBankService.show(employeeBankResponse._data.data.employeeBank.employeeBankId)
        if (employeeBankResponse.status === 200) {
          const employeeBank = employeeBankResponse._data.data.employeeBank.employeeBank
          this.$emit('onEmployeeBankSave', employeeBank as EmployeeBankInterface)
        }
      } else {
        const msgError = employeeBankResponse._data.error ? employeeBankResponse._data.error : employeeBankResponse._data.message
        const severityType = employeeBankResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Employee bank ${this.employeeBank.employeeBankId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    formatAccountClabe() {
      if (!this.employeeBank.employeeBankAccountClabe) {
        return
      }
      let formatted = this.employeeBank.employeeBankAccountClabe.replace(/\D/g, ''); // Remove non-digits

      // Ensure the account is exactly 18 digits and format it
      if (formatted.length > 18) {
        formatted = formatted.substring(0, 18);
      }

      // Apply the format: Bank Code (3), Branch Code (3), Account Number (11), Control Digit (1)
      if (formatted.length <= 3) {
        this.employeeBank.employeeBankAccountClabe = formatted;
      } else if (formatted.length <= 6) {
        this.employeeBank.employeeBankAccountClabe = `${formatted.slice(0, 3)} ${formatted.slice(3)}`;
      } else if (formatted.length <= 17) {
        this.employeeBank.employeeBankAccountClabe = `${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 17)}`;
      } else {
        this.employeeBank.employeeBankAccountClabe = `${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 17)} ${formatted.slice(17)}`;
      }
    },
    formatAccountNumber() {
      if (!this.employeeBank.employeeBankAccountNumber) {
        return
      }
      let formattedAccountNumber = this.employeeBank.employeeBankAccountNumber.replace(/\D/g, ''); // Remove non-numeric characters

      // Group the account number into blocks of 3 digits (e.g., '000 011 814 128')
      if (formattedAccountNumber.length <= 3) {
        this.employeeBank.employeeBankAccountNumber = formattedAccountNumber;
      } else if (formattedAccountNumber.length <= 6) {
        this.employeeBank.employeeBankAccountNumber = `${formattedAccountNumber.slice(0, 3)} ${formattedAccountNumber.slice(3)}`;
      } else if (formattedAccountNumber.length <= 9) {
        this.employeeBank.employeeBankAccountNumber = `${formattedAccountNumber.slice(0, 3)} ${formattedAccountNumber.slice(3, 6)} ${formattedAccountNumber.slice(6)}`;
      } else {
        this.employeeBank.employeeBankAccountNumber = `${formattedAccountNumber.slice(0, 3)} ${formattedAccountNumber.slice(3, 6)} ${formattedAccountNumber.slice(6, 9)} ${formattedAccountNumber.slice(9, 11)}`;
      }
    },
  }
})