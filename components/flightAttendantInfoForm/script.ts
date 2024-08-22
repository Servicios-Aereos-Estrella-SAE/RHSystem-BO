import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { FlightAttendantInterface } from '~/resources/scripts/interfaces/FlightAttendantInterface'
import FlightAttendantService from '~/resources/scripts/services/FlightAttendantService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PeopleInterface } from '~/resources/scripts/interfaces/PeopleInterface'
import { DateTime } from 'luxon';
import PersonService from '~/resources/scripts/services/PersonService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'flightAttendantInfoForm',
  props: {
    flightAttendant: { type: Object as PropType<FlightAttendantInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    submitted: false,
    genders: [
        { label: 'Male', value: 'Hombre' },
        { label: 'Female', value: 'Mujer' },
        { label: 'Other', value: 'Otro' }
    ],
    currenFlightAttendant: null as FlightAttendantInterface | null,
    passwordConfirm: '',
    changePassword: false,
    isNewFlightAttendant: false,
    isReady: false,
    drawerShiftExceptions: false,
    drawerShifts: false,
    drawerProceedingFiles: false,
    isValidPhone: true,
    isValidCURP: true,
    isValidRFC: true,
    files: [] as Array<any>,
    currentDate: null as string | null,
    dateWasChange: false,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewFlightAttendant = !this.flightAttendant.flightAttendantId ? true : false
    this.currentDate = `${this.flightAttendant.flightAttendantHireDate}`
    await this.formatDate('hireDate')
    await this.formatDate('birthday')
    this.dateWasChange = false
    this.isReady = true
  },
  methods: {
    onUpload(event: any) {
      this.flightAttendant.flightAttendantPhoto = event.files[0];
    },
    onSelect(event: any) {
      this.flightAttendant.flightAttendantPhoto = event.files[0];
    },
    async onSave() {
      this.submitted = true
      this.isValidPhone = true
      this.isValidCURP = true
      this.isValidRFC = true
      const flightAttendantService = new FlightAttendantService()
      const personService = new PersonService()
      if (!flightAttendantService.validateFlightAttendantInfo(this.flightAttendant)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      if (this.flightAttendant.person?.personPhone && !/^\d{10}$/.test(this.flightAttendant.person.personPhone)) {
        this.isValidPhone = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Phone number is not valid',
            life: 5000,
        })
        return
      }
      if (this.flightAttendant.person?.personCurp && !personService.isValidCURP(this.flightAttendant.person?.personCurp)) {
        this.isValidCURP = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Personal identification is not valid',
            life: 5000,
        })
        return
      }
      if (this.flightAttendant.person?.personRfc && !personService.isValidRFC(this.flightAttendant.person?.personRfc)) {
        this.isValidRFC = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'RFC is not valid',
            life: 5000,
        })
        return
      }

      if (this.files.length > 1) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Image invalid',
          detail: 'Only one image is allowed',
          life: 5000,
        })
        return
      }
      for await (const file of this.files) {
        if (file) {
          const mimeType = file.type;
          const isAudioOrVideo = mimeType.startsWith('image/');
          if (!isAudioOrVideo) {
            this.$toast.add({
              severity: 'warn',
              summary: 'Image invalid',
              detail: 'Only select image.',
              life: 5000,
            })
            return
          }
        }
      }
      const flightAttendantHireDateTemp = this.flightAttendant.flightAttendantHireDate
      if (!this.dateWasChange) {
        this.flightAttendant.flightAttendantHireDate = this.currentDate
      } else {
        if (this.flightAttendant.flightAttendantHireDate) {
          this.flightAttendant.flightAttendantHireDate = this.getDate(this.flightAttendant.flightAttendantHireDate.toString())
        }
      }
      let personResponse = null
      if (this.flightAttendant && this.flightAttendant.person) {
        if (!this.flightAttendant.person.personId) {
          personResponse = await personService.store(this.flightAttendant.person)
        } else {
          personResponse = await personService.update(this.flightAttendant.person)
        }
        if (personResponse.status === 201) {
          this.flightAttendant.personId = personResponse._data.data.person.personId
          this.flightAttendant.person = {
            ...this.flightAttendant.person,
            personId: personResponse._data.data.person.personId
          } as PeopleInterface
        } else {
          const msgError = personResponse._data.error ? personResponse._data.error : personResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `Flight attendant ${this.flightAttendant.flightAttendantId ? 'updated' : 'created'}`,
            detail: msgError,
              life: 5000,
          })
          return
        }
        let flightAttendantResponse = null
        const image = this.files.length > 0 ? this.files[0] : null
        if (!this.flightAttendant.flightAttendantId) {
          flightAttendantResponse = await flightAttendantService.store(this.flightAttendant, image)
        } else {
          flightAttendantResponse = await flightAttendantService.update(this.flightAttendant, image)
        }
        if (flightAttendantResponse.status === 201 || flightAttendantResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `Flight attendant ${this.flightAttendant.flightAttendantId ? 'updated' : 'created'}`,
            detail: flightAttendantResponse._data.message,
              life: 5000,
          })
          flightAttendantResponse = await flightAttendantService.show(flightAttendantResponse._data.data.flightAttendant.flightAttendantId)
          if (flightAttendantResponse?.status === 200) {
            const flightAttendant = flightAttendantResponse._data.data.flightAttendant
            this.$emit('save', flightAttendant as FlightAttendantInterface)
          }
        } else {
          const msgError = flightAttendantResponse._data.error ? flightAttendantResponse._data.error : flightAttendantResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `Flight attendant ${this.flightAttendant.flightAttendantId ? 'updated' : 'created'}`,
            detail: msgError,
              life: 5000,
          })
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: `Flight attendant ${this.flightAttendant.flightAttendantId ? 'updated' : 'created'}`,
          detail: 'Person not found',
            life: 5000,
        })
      }
      this.flightAttendant.flightAttendantHireDate = flightAttendantHireDateTemp
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
    getShiftExceptions() {
      this.drawerShiftExceptions = true
    },
    getShifts() {
      this.drawerShifts = true
    },
    getProceedingFiles() {
      this.drawerProceedingFiles = true
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
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
    formatDate(propertyName: string) {
      let currentDate = propertyName === 'birthday' ? this.flightAttendant.person?.personBirthday : this.flightAttendant.flightAttendantHireDate
      if (this.flightAttendant && currentDate) {
        let newDate = null
        currentDate = currentDate.toString()
        // const currentDate = this.flightAttendant.flightAttendantHireDate.toString()
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
          if (propertyName === 'hireDate') {
            this.flightAttendant.flightAttendantHireDate = newDate
          } else {
            if (this.flightAttendant.person) {
              this.flightAttendant.person.personBirthday = newDate
            }
          }
        }
      }
      if (propertyName === 'hireDate') {
        this.dateWasChange = true
      }
    },
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    }
  },
})