import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { EmployeeChildrenInterface } from '~/resources/scripts/interfaces/EmployeeChildrenInterface';
import EmployeeChildrenService from '~/resources/scripts/services/EmployeeChildrenService';
import { DateTime } from 'luxon';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeChildrenInfoForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employeeChildren: { type: Object as PropType<EmployeeChildrenInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    submitted: false,
    genders: [
      { label: 'Male', value: 'Hombre' },
      { label: 'Female', value: 'Mujer' },
      { label: 'Not_specified', value: 'Otro' }
    ],
    isNewChildren: false,
    isReady: false,
    childrenBirthday: '' as string,
    displayChildrenBirthDateCalendar: false as boolean,
    localeToUse: 'en',
  }),
  computed: {
    getGenders() {
      return this.genders.map(gender => ({
        label: this.$t(`genders.${gender.label.toLowerCase()}`),
        value: gender.value
      }));
    }
  },
  watch: {
    'employeeChildren.employeeChildrenBirthday'(val: Date) {
      this.childrenBirthday = this.getBirthdayFormatted(val)
    },
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    this.isReady = false
    this.isNewChildren = !this.employeeChildren.employeeChildrenId ? true : false
    if (this.employeeChildren.employeeChildrenId) {
      this.setBirthday()
    }
    this.isReady = true

  },
  methods: {
    setBirthday() {
      if (this.employeeChildren?.employeeChildrenBirthday) {
        const year = `${this.employeeChildren?.employeeChildrenBirthday}`.split('T')[0].split('-')[0]
        const month = `${this.employeeChildren?.employeeChildrenBirthday}`.split('T')[0].split('-')[1]
        const day = `${this.employeeChildren?.employeeChildrenBirthday}`.split('T')[0].split('-')[2]

        const birthDay = DateTime.fromISO(`${year}-${month}-${day}T00:00:00.000-06:00`, { setZone: true })
          .setZone('UTC-6')
          .setLocale(this.localeToUse)
          .toJSDate()

        this.employeeChildren.employeeChildrenBirthday = birthDay
        this.childrenBirthday = this.getBirthdayFormatted(this.employeeChildren?.employeeChildrenBirthday as Date)
      }
    },
    async onSave() {
      this.submitted = true
      const employeeChildrenService = new EmployeeChildrenService()
      if (this.employeeChildren) {
        if (!employeeChildrenService.validateInfo(this.employeeChildren)) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: this.t('missing_data'),
            life: 5000,
          })
          return
        }
        const employeeChildrenBirthday: string | Date | null = this.employeeChildren.employeeChildrenBirthday ?? null
        this.employeeChildren.employeeChildrenBirthday = this.convertToDateTime(employeeChildrenBirthday)
        let employeeChildrenResponse = null
        if (!this.employeeChildren.employeeChildrenId) {
          employeeChildrenResponse = await employeeChildrenService.store(this.employeeChildren)
        } else {
          employeeChildrenResponse = await employeeChildrenService.update(this.employeeChildren)
        }
        if (employeeChildrenResponse.status === 201 || employeeChildrenResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `${this.t('employee_children')} ${this.employeeChildren.employeeChildrenId ? this.t('updated') : this.t('created')}}`,
            detail: employeeChildrenResponse._data.message,
            life: 5000,
          })

          employeeChildrenResponse = await employeeChildrenService.show(employeeChildrenResponse._data.data.employeeChildren.employeeChildrenId)
          this.$emit('save', employeeChildrenResponse._data.data.employeeChildren.employeeChildren as EmployeeChildrenInterface)
        } else {
          const msgError = employeeChildrenResponse._data.error ? employeeChildrenResponse._data.error : employeeChildrenResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `${this.t('employee_children')} ${this.employeeChildren.employeeChildrenId ? this.t('updated') : this.t('created')}}`,
            detail: msgError,
            life: 5000,
          })
          return
        }
      }
    },
    handlerDisplayChildrenBirthDate() {
      this.displayChildrenBirthDateCalendar = true
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
    getBirthdayFormatted(date: Date) {
      return DateTime.fromJSDate(date)
        .setZone('UTC-6')
        .setLocale(this.localeToUse)
        .toFormat('DDDD')
    },
  }
})
