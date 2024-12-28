import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface'
import AircraftOperatorService from '~/resources/scripts/services/AircraftOperatorService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { DateTime } from 'luxon';
import PersonService from '~/resources/scripts/services/PersonService';
import type { AircraftOperatorInterface } from '~/resources/scripts/interfaces/AircraftOperatorInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'AircraftOperatorInfoForm',
  props: {
    aircraftOperator: { type: Object as PropType<AircraftOperatorInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    currentAircraftOperator: null as AircraftOperatorInterface | null,
    passwordConfirm: '',
    changePassword: false,
    isNewAircraftOperator: false,
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
  watch: {
    'aircraftOperator.aircraftOperatorName': {
      handler: function (val: string) {
        // generate slug with name
        this.aircraftOperator.aircraftOperatorSlug = val.toLowerCase().replace(/ /g, '-')
      },
      immediate: true
    },
  },
  async mounted() {
    this.isReady = false
    this.isNewAircraftOperator = !this.aircraftOperator.aircraftOperatorId ? true : false
    this.currentDate = `${this.aircraftOperator.pilotHireDate}`
    this.dateWasChange = false
    this.isReady = true
    this.activeSwicht = this.aircraftOperator.aircraftOperatorActive === 1 ? true : false
  },
  methods: {
    onUpload(event: any) {
      this.aircraftOperator.pilotPhoto = event.files[0];
    },
    onSelect(event: any) {
      this.aircraftOperator.pilotPhoto = event.files[0];
    },
    async onSave() {
      this.submitted = true
      const aircraftOperatorService = new AircraftOperatorService()
      if (!aircraftOperatorService.validateAircraftOperatorInfo(this.aircraftOperator)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
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
      this.aircraftOperator.aircraftOperatorActive = this.activeSwicht ? 1 : 0
      this.aircraftOperator.aircraftOperatorImage = ''
      let aircraftOperatorResponse = null
      if (this.aircraftOperator) {
        const image = this.files.length > 0 ? this.files[0] : null
        if (!this.aircraftOperator.aircraftOperatorId) {
          aircraftOperatorResponse = await aircraftOperatorService.store(this.aircraftOperator, image)
        } else {
          aircraftOperatorResponse = await aircraftOperatorService.update(this.aircraftOperator, image)
        }
        if (aircraftOperatorResponse.status === 201 || aircraftOperatorResponse.status === 200) {
          this.aircraftOperator.aircraftOperatorId = aircraftOperatorResponse._data.data.operator.aircraftOperatorId
          this.$toast.add({
            severity: 'success',
            summary: `Pilot ${this.aircraftOperator.aircraftOperatorId ? 'updated' : 'created'}`,
            detail: aircraftOperatorResponse._data.message,
              life: 5000,
          })
          aircraftOperatorResponse = await aircraftOperatorService.show(aircraftOperatorResponse._data.data.operator.aircraftOperatorId)
          if (aircraftOperatorResponse?.status === 200) {
            const aircraftOperator = aircraftOperatorResponse._data.data.operator
            this.$emit('save', aircraftOperator as PilotInterface)
          }
        } else {
          const msgError = aircraftOperatorResponse._data.error ? aircraftOperatorResponse._data.error : aircraftOperatorResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `Aircraft ${this.aircraftOperator.aircraftOperatorId ? 'updated' : 'created'}`,
            detail: msgError,
              life: 5000,
          })
          return
        }
      }
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
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    }
  },
})