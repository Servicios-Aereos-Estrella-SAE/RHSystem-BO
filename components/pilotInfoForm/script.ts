import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface'
import PilotService from '~/resources/scripts/services/PilotService'
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
  name: 'pilotInfoForm',
  props: {
    pilot: { type: Object as PropType<PilotInterface>, required: true },
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
    currenPilot: null as PilotInterface | null,
    passwordConfirm: '',
    changePassword: false,
    isNewPilot: false,
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
    this.isNewPilot = !this.pilot.pilotId ? true : false
    this.currentDate = `${this.pilot.pilotHireDate}`
    await this.formatDate()
    this.dateWasChange = false
    this.isReady = true
  },
  methods: {
    onUpload(event: any) {
      this.pilot.pilotPhoto = event.files[0];
    },
    onSelect(event: any) {
      this.pilot.pilotPhoto = event.files[0];
    },
    async onSave() {
      this.submitted = true
      this.isValidPhone = true
      this.isValidCURP = true
      this.isValidRFC = true
      const pilotService = new PilotService()
      const personService = new PersonService()
      if (!pilotService.validatePilotInfo(this.pilot)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      if (this.pilot.person?.personPhone && !/^\d{10}$/.test(this.pilot.person.personPhone)) {
        this.isValidPhone = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Phone number is not valid',
            life: 5000,
        })
        return
      }
      if (this.pilot.person?.personCurp && !personService.isValidCURP(this.pilot.person?.personCurp)) {
        this.isValidCURP = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Personal identification is not valid',
            life: 5000,
        })
        return
      }
      if (this.pilot.person?.personRfc && !personService.isValidRFC(this.pilot.person?.personRfc)) {
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
      const pilotHireDateTemp = this.pilot.pilotHireDate
      if (!this.dateWasChange) {
        this.pilot.pilotHireDate = this.currentDate
      } else {
        if (this.pilot.pilotHireDate) {
          this.pilot.pilotHireDate = this.getDate(this.pilot.pilotHireDate.toString())
        }
      }
      let personResponse = null
      if (this.pilot && this.pilot.person) {
        if (!this.pilot.person.personId) {
          personResponse = await personService.store(this.pilot.person)
        } else {
          personResponse = await personService.update(this.pilot.person)
        }
        if (personResponse.status === 201) {
          this.pilot.personId = personResponse._data.data.person.personId
          this.pilot.person = {
            ...this.pilot.person,
            personId: personResponse._data.data.person.personId
          } as PeopleInterface
        } else {
          const msgError = personResponse._data.error ? personResponse._data.error : personResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `Pilot ${this.pilot.pilotId ? 'updated' : 'created'}`,
            detail: msgError,
              life: 5000,
          })
          return
        }
        let pilotResponse = null
        const image = this.files.length > 0 ? this.files[0] : null
        if (!this.pilot.pilotId) {
          pilotResponse = await pilotService.store(this.pilot, image)
        } else {
          pilotResponse = await pilotService.update(this.pilot, image)
        }
        if (pilotResponse.status === 201 || pilotResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `Pilot ${this.pilot.pilotId ? 'updated' : 'created'}`,
            detail: pilotResponse._data.message,
              life: 5000,
          })
          pilotResponse = await pilotService.show(pilotResponse._data.data.pilot.pilotId)
          if (pilotResponse?.status === 200) {
            const pilot = pilotResponse._data.data.pilot
            this.$emit('save', pilot as PilotInterface)
          }
        } else {
          const msgError = pilotResponse._data.error ? pilotResponse._data.error : pilotResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `Pilot ${this.pilot.pilotId ? 'updated' : 'created'}`,
            detail: msgError,
              life: 5000,
          })
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: `Pilot ${this.pilot.pilotId ? 'updated' : 'created'}`,
          detail: 'Person not found',
            life: 5000,
        })
      }
      this.pilot.pilotHireDate = pilotHireDateTemp
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
    dateYear() {
      if (!this.pilot.pilotHireDate) {
        return 0
      }

      const year = parseInt(`${this.pilot.pilotHireDate.toString().split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.pilot.pilotHireDate) {
        return 0
      }

      const month = parseInt(`${this.pilot.pilotHireDate.toString().split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.pilot.pilotHireDate) {
        return 0
      }

      const day = parseInt(`${this.pilot.pilotHireDate.toString().split('-')[2]}`)
      return day
    },
    formatDate() {
      if (this.pilot && this.pilot.pilotHireDate) {
        const date = DateTime.local(this.dateYear(), this.dateMonth(), this.dateDay(), 0)
        const day = date.toFormat('yyyy-MM-dd')
        if (date.isValid) {
          this.pilot.pilotHireDate = day
        } else {
          const newDate = DateTime.fromHTTP(this.pilot.pilotHireDate.toString())
          if (date.isValid) {
            const day = newDate.toFormat('yyyy-MM-dd')
            this.pilot.pilotHireDate = day
          }
        }
      }
      this.dateWasChange = true
    },
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    }
  },
})