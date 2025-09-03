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
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    employeeBank: { type: Object as PropType<EmployeeBankInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canManageUserResponsible: { type: Boolean, required: true },
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
    isValidAccountClabe: true,
    isValidAccountNumber: false,
    isValidAccountCardNumber: true,
    localeToUse: 'en',
  }),
  computed: {
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isNewEmployeeBank = !this.employeeBank.employeeBankId ? true : false
    if (this.employeeBank.employeeBankAccountClabe) {
      const employeeBankService = new EmployeeBankService()
      this.isReady = false

      if (this.employee.deletedAt) {
        this.isDeleted = true
      }
      if (this.employeeBank.employeeBankId) {


        const valueDecrypt = await employeeBankService.decrypt(this.employeeBank.employeeBankAccountClabe, this.$config.public.APP_ENCRYPT_KEY)
        this.employeeBank.employeeBankAccountClabe = valueDecrypt ? valueDecrypt : null
      }
      if (this.employeeBank.employeeBankAccountNumber) {
        const valueDecrypt = await employeeBankService.decrypt(this.employeeBank.employeeBankAccountNumber, this.$config.public.APP_ENCRYPT_KEY)
        this.employeeBank.employeeBankAccountNumber = valueDecrypt ? valueDecrypt : null
      }
      if (this.employeeBank.employeeBankAccountCardNumber) {
        const valueDecrypt = await employeeBankService.decrypt(this.employeeBank.employeeBankAccountCardNumber, this.$config.public.APP_ENCRYPT_KEY)
        this.employeeBank.employeeBankAccountCardNumber = valueDecrypt ? valueDecrypt : null
        if (this.employeeBank.employeeBankAccountCardNumber) {
          this.employeeBank.employeeBankAccountType = employeeBankService.getIssuer(this.employeeBank.employeeBankAccountCardNumber)
        }
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
      return dateEmployeeBank.setLocale(this.localeToUse).toFormat('DDDD')
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
      this.isValidAccountCardNumber = true
      const employeeBankService = new EmployeeBankService()
      if (!this.employeeBank.bankId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if (!this.employeeBank.employeeBankAccountClabe) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      this.isValidAccountClabe = employeeBankService.validateAccountCLABE(this.employeeBank.employeeBankAccountClabe)
      if (!this.isValidAccountClabe) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: `${this.t('account_clabe')} ${this.t('is_not_valid')}`,
          life: 5000,
        })
        return
      }
      if (this.employeeBank.employeeBankAccountNumber) {
        if (this.employeeBank.employeeBankAccountNumber.toString().length !== 10) {
          this.isValidAccountNumber = false
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: `${this.t('account_number')} ${this.t('is_not_valid')}`,
            life: 5000,
          })
          return
        }
      }
      if (this.employeeBank.employeeBankAccountCardNumber) {
        this.isValidAccountCardNumber = employeeBankService.validCard(this.employeeBank.employeeBankAccountCardNumber)
        if (!this.isValidAccountCardNumber) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: `${this.t('account_card_number')} ${this.t('is_not_valid')}`,
            life: 5000,
          })
          return
        }
      }
      if (!this.employeeBank.employeeBankAccountCurrencyType) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
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
          summary: `${this.t('employee_bank')} ${this.employeeBank.employeeBankId ? this.t('updated') : this.t('created')}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    restrictInput(event: any) {
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete']
      const key = event.key;
      if (allowedKeys.includes(key)) {
        return
      }
      if (!/\d/.test(key)) {
        event.preventDefault()
      }
    },
    validateAccountClabe() {
      this.isValidAccountClabe = true
      if (this.employeeBank.employeeBankAccountClabe) {
        const employeeBankService = new EmployeeBankService()
        this.isValidAccountClabe = employeeBankService.validateAccountCLABE(this.employeeBank.employeeBankAccountClabe)
      }
    },
    validateAccountCard() {
      this.isValidAccountCardNumber = true
      this.employeeBank.employeeBankAccountType = ''
      if (this.employeeBank.employeeBankAccountCardNumber) {
        const employeeBankService = new EmployeeBankService()
        this.isValidAccountCardNumber = employeeBankService.validCard(this.employeeBank.employeeBankAccountCardNumber)
        this.employeeBank.employeeBankAccountType = employeeBankService.getIssuer(this.employeeBank.employeeBankAccountCardNumber)
      }
    }
  }
})