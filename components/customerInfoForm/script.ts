import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { CustomerInterface } from '~/resources/scripts/interfaces/CustomerInterface'
import CustomerService from '~/resources/scripts/services/CustomerService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PeopleInterface } from '~/resources/scripts/interfaces/PeopleInterface'
import PersonService from '~/resources/scripts/services/PersonService';
import { DateTime } from 'luxon';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'customerInfoForm',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    customer: { type: Object as PropType<CustomerInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    genders: [
      { label: 'Male', value: 'Hombre' },
      { label: 'Female', value: 'Mujer' },
      { label: 'Not_specified', value: 'Otro' }
    ],
    currenCustomer: null as CustomerInterface | null,
    isNewCustomer: false,
    isReady: false,
    drawerProceedingFiles: false,
    isValidPhone: true,
    isValidCURP: true,
    isValidRFC: true,
  }),
  computed: {
    getGenders() {
      return this.genders.map(gender => ({
        label: this.$t(`genders.${gender.label.toLowerCase()}`),
        value: gender.value
      }));
    },
  },
  async mounted() {
    this.isReady = false
    this.isNewCustomer = !this.customer.customerId ? true : false
    await this.formatDate()
    this.isReady = true
  },
  methods: {
    onUpload(event: any) {
      this.customer.customerPhoto = event.files[0];
    },
    onSelect(event: any) {
      this.customer.customerPhoto = event.files[0];
    },
    async onSave() {
      this.submitted = true
      this.isValidPhone = true
      this.isValidCURP = true
      this.isValidRFC = true
      const customerService = new CustomerService()
      const personService = new PersonService()
      if (!customerService.validateCustomerInfo(this.customer)) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (this.customer.person?.personPhone && !/^\d{10}$/.test(this.customer.person.personPhone)) {
        this.isValidPhone = false
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: `${this.t('phone')} ${this.t('is_not_valid')}`,
          life: 5000,
        })
        return
      }
      if (this.customer.person?.personCurp && !personService.isValidCURP(this.customer.person?.personCurp)) {
        this.isValidCURP = false
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: `CURP ${this.t('is_not_valid')}`,
          life: 5000,
        })
        return
      }
      if (this.customer.person?.personRfc && !personService.isValidRFC(this.customer.person?.personRfc)) {
        this.isValidRFC = false
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: `RFC ${this.t('is_not_valid')}`,
          life: 5000,
        })
        return
      }
      let personResponse = null
      if (this.customer && this.customer.person) {
        if (!this.customer.person.personId) {
          personResponse = await personService.store(this.customer.person)
        } else {
          personResponse = await personService.update(this.customer.person)
        }
        if (personResponse.status === 201) {
          this.customer.personId = personResponse._data.data.person.personId
          this.customer.person = {
            ...this.customer.person,
            personId: personResponse._data.data.person.personId
          } as PeopleInterface
        } else {
          const msgError = personResponse._data.error ? personResponse._data.error : personResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `${this.t('customer')} ${this.customer.customerId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
          return
        }
        let customerResponse = null
        if (!this.customer.customerId) {
          customerResponse = await customerService.store(this.customer)
        } else {
          customerResponse = await customerService.update(this.customer)
        }
        if (customerResponse.status === 201 || customerResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `${this.t('customer')} ${this.customer.customerId ? this.t('updated') : this.t('created')}`,
            detail: customerResponse._data.message,
            life: 5000,
          })
          customerResponse = await customerService.show(customerResponse._data.data.customer.customerId)
          if (customerResponse?.status === 200) {
            const customer = customerResponse._data.data.customer
            this.$emit('save', customer as CustomerInterface)
          }
        } else {
          const msgError = customerResponse._data.error ? customerResponse._data.error : customerResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `${this.t('customer')} ${this.customer.customerId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: `${this.t('customer')} ${this.customer.customerId ? this.t('updated') : this.t('created')}`,
          detail: this.t('person_not_found'),
          life: 5000,
        })
      }
    },
    getProceedingFiles() {
      this.drawerProceedingFiles = true
    },
    convertToDateTime(birthday: string | Date | null): Date | null {
      if (birthday === '' || birthday === null || birthday === undefined) {
        return null;
      }
      // Si el cumpleaños ya es un objeto Date, retorna directamente
      if (birthday instanceof Date) {
        return birthday;
      }
      // Si el cumpleaños es una cadena de texto, intenta convertirla a Date
      const date = new Date(birthday);
      return isNaN(date.getTime()) ? null : date;
    },
    dateYear(date: string) {
      if (!date) {
        return 0
      }

      const year = parseInt(`${date.toString().split('-')[0]}`)
      return year
    },
    dateMonth(date: string) {
      if (!date) {
        return 0
      }

      const month = parseInt(`${date.toString().split('-')[1]}`)
      return month
    },
    dateDay(date: string) {
      if (!date) {
        return 0
      }

      const day = parseInt(`${date.toString().split('-')[2]}`)
      return day
    },
    formatDate() {
      if (this.customer && this.customer.person?.personBirthday) {
        const currentDate = this.customer.person?.personBirthday.toString()
        let newDate = null
        const date = DateTime.local(this.dateYear(currentDate), this.dateMonth(currentDate), this.dateDay(currentDate), 0)
        const day = date.toFormat('yyyy-MM-dd')
        if (date.isValid) {
          newDate = day
        } else {
          const otherDate = DateTime.fromHTTP(currentDate)
          if (date.isValid) {
            const day = otherDate.toFormat('yyyy-MM-dd')
            newDate = day
          }
        }
        if (newDate) {
          this.customer.person.personBirthday = newDate
        }
      }
    },
  },
})