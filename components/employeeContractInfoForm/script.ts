import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { EmployeeContractInterface } from '~/resources/scripts/interfaces/EmployeeContractInterface';
import EmployeeContractService from '~/resources/scripts/services/EmployeeContractService';
import { DateTime } from 'luxon';
import EmployeeContractTypeService from '~/resources/scripts/services/EmployeeContractTypeService';
import type { EmployeeContractTypeInterface } from '~/resources/scripts/interfaces/EmployeeContractTypeInterface';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import PositionService from '~/resources/scripts/services/PositionService';
import DepartmentService from '~/resources/scripts/services/DepartmentService';
import type { BusinessUnitInterface } from '~/resources/scripts/interfaces/BusinessUnitInterface';
import BusinessUnitService from '~/resources/scripts/services/BusinessUnitService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeeContractInfoForm',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    employeeContract: { type: Object as PropType<EmployeeContractInterface>, required: true },
    clickOnSave: { type: Function, default: null }
  },
  data: () => ({
    employeeContractTypeList: [] as EmployeeContractTypeInterface[],
    submitted: false,
    isNewEmployeeContract: false,
    isReady: false,
    isDeleted: false,
    files: [] as Array<any>,
    dates: [] as Array<any>,
    employeeContractStatusOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Expired', value: 'expired' },
      { label: 'Cancelled', value: 'cancelled' }
    ],
    startDate: '' as string,
    displayStartDateCalendar: false as boolean,
    endDate: '' as string,
    displayEndDateCalendar: false as boolean,
    isContractPermanent: false,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    businessUnits: [] as BusinessUnitInterface[],
    maxDate: new Date() as Date,
    activeSwicht: true,
    localeToUse: 'en',
  }),
  computed: {
    getEmployeeContractStatusOptions() {
      return this.employeeContractStatusOptions.map(option => ({
        label: this.t(`contract_status.${option.value}`),
        value: option.value
      }));
    }
  },
  watch: {
    dates(newRange) {
      if (newRange.length === 2) {
        this.employeeContract.employeeContractStartDate = newRange[0]
        this.employeeContract.employeeContractEndDate = newRange[1]
      }
    },
    'employeeContract.departmentId': function (newVal) {
      if (newVal) {
        this.getPositions(newVal);
      }
    },
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewEmployeeContract = !this.employeeContract.employeeContractId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.getDepartments()
    this.getBusinessUnits()
    this.employeeContractTypeList = await this.getEmployeeContractTypes()
    if (this.employeeContract.employeeContractId) {
      this.verifyContractPermanent()
      if (this.employeeContract.employeeContractStartDate) {
        const startIsoDate = this.employeeContract.employeeContractStartDate.toString()
        const startNewDate = DateTime.fromISO(startIsoDate, { zone: 'utc' }).toISODate()
        if (startNewDate) {
          this.employeeContract.employeeContractStartDate = startNewDate
        }
      }
      if (this.employeeContract.employeeContractEndDate) {
        const endIsoDate = this.employeeContract.employeeContractEndDate.toString()
        const endNewDate = DateTime.fromISO(endIsoDate, { zone: 'utc' }).toISODate()
        if (endNewDate) {
          this.employeeContract.employeeContractEndDate = endNewDate
        }
      }
      if (this.employeeContract.departmentId) {
        await this.getPositions(this.employeeContract.departmentId)
      }

      if (this.employeeContract.department) {
        const existCurrentDepartment = this.departments.find(a => a.departmentId === this.employeeContract.departmentId)
        if (!existCurrentDepartment) {
          this.departments.push(this.employeeContract.department)
        }
      }
      if (this.employeeContract.position) {
        const existCurrentPosition = this.positions.find(a => a.positionId === this.employeeContract.positionId)
        if (!existCurrentPosition) {
          this.positions.push(this.employeeContract.position)
        }
      }
    }

    let isActive: number = 1
    isActive = this.employeeContract.employeeContractActive
    this.activeSwicht = isActive === 1 ? true : false

    const toSnakeCase = (str: string): string =>
      str
        .toLowerCase()
        .replace(/[\s\-]+/g, '_') // espacios o guiones a guion bajo
        .replace(/[^\w_]/g, '')   // quita caracteres especiales

    const capitalizeFirstLetter = (str: string): string =>
      str.charAt(0).toUpperCase() + str.slice(1)

    const contractTypesTranslated = this.employeeContractTypeList.map(contract => {
      const key = toSnakeCase(contract.employeeContractTypeName)
      const translated = this.t(key)

      return {
        ...contract,
        employeeContractTypeName:
          translated === key ? capitalizeFirstLetter(contract.employeeContractTypeName) : translated
      }
    })
    this.employeeContractTypeList = contractTypesTranslated

    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getDepartments() {
      let response = null
      const departmentService = new DepartmentService()
      response = await departmentService.getAllDepartmentList()
      this.departments = response._data.data.departments
    },
    async getPositions(departmentId: number) {
      const positionService = new PositionService()
      this.positions = await positionService.getPositionsDepartment(departmentId)
    },
    async getBusinessUnits() {
      const body = await new BusinessUnitService().index()
      this.businessUnits = body.status === 200 ? body._data.data.data || [] : []
    },
    getDate(date: string | Date) {
      if (!date) {
        return ''
      }

      if (typeof date === 'string' && !date.includes('T')) {
        date = new Date(date)
      }
      const dateEmployeeContract = DateTime.fromJSDate(new Date(date), { zone: 'local' })
      return dateEmployeeContract.setLocale(this.localeToUse).toFormat('DDDD')
    },
    async getEmployeeContractTypes() {
      const response = await new EmployeeContractTypeService().getFilteredList('', 1, 100)
      const list: EmployeeContractTypeInterface[] = response.status === 200 ? response._data.data.employeeContractTypes.data : []
      return list
    },
    async onSave() {
      this.submitted = true
      const employeeContractService = new EmployeeContractService()
      if (!this.employeeContract.departmentId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.employeeContract.positionId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.employeeContract.payrollBusinessUnitId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.employeeContract.employeeContractTypeId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.employeeContract.employeeContractFolio) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.employeeContract.employeeContractStartDate) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.isContractPermanent && !this.employeeContract.employeeContractEndDate) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        });
        return
      }
      if (!this.employeeContract.employeeContractStatus) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (!this.employeeContract.employeeContractMonthlyNetSalary || this.employeeContract.employeeContractMonthlyNetSalary === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      for await (const file of this.files) {
        if (file) {
          const mimeType = file.type;
          const isAudioOrVideo = mimeType.startsWith('audio/') || mimeType.startsWith('video/');
          if (isAudioOrVideo) {
            this.$toast.add({
              severity: 'warn',
              summary: this.t('file_invalid'),
              detail: this.t('audio_or_video_files_are_not_allowed'),
              life: 5000,
            })
            return
          }
        }
      }
      const files = this.files.length > 0 ? this.files[0] : null
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let employeeContractResponse = null
      const employeeContractStartDateTemp = this.employeeContract.employeeContractStartDate
      if (this.employeeContract.employeeContractStartDate) {
        this.employeeContract.employeeContractStartDate = DateTime.fromJSDate(new Date(this.employeeContract.employeeContractStartDate))
          .toFormat('yyyy-MM-dd');
      }
      const employeeContractEndDateTemp = this.employeeContract.employeeContractEndDate
      if (this.employeeContract.employeeContractEndDate) {
        this.employeeContract.employeeContractEndDate = DateTime.fromJSDate(new Date(this.employeeContract.employeeContractEndDate))
          .toFormat('yyyy-MM-dd');
      }
      this.employeeContract.employeeContractActive = this.activeSwicht ? 1 : 0
      if (!this.employeeContract.employeeContractId) {
        employeeContractResponse = await employeeContractService.store(this.employeeContract, files)
      } else {
        employeeContractResponse = await employeeContractService.update(this.employeeContract, files)
      }

      if (employeeContractResponse.status === 201 || employeeContractResponse.status === 200) {
        employeeContractResponse = await employeeContractService.show(employeeContractResponse._data.data.employeeContract.employeeContractId)
        if (employeeContractResponse.status === 200) {
          const employeeContract = employeeContractResponse._data.data.employeeContract
          this.$emit('onEmployeeContractSave', employeeContract as EmployeeContractInterface)
        }
      } else {
        const msgError = employeeContractResponse._data.error ? employeeContractResponse._data.error : employeeContractResponse._data.message
        const severityType = employeeContractResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `${this.t('employee_contract')} ${this.employeeContract.employeeContractId ? this.t('updated') : this.t('created')}}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.employeeContract.employeeContractStartDate = employeeContractStartDateTemp
      this.employeeContract.employeeContractEndDate = employeeContractEndDateTemp
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    openFile() {
      window.open(this.employeeContract?.employeeContractFile)
    },
    handlerDisplayStartDate() {
      this.displayStartDateCalendar = true
    },
    handlerDisplayEndDate() {
      this.displayEndDateCalendar = true
    },
    verifyContractPermanent() {
      this.isContractPermanent = false
      const employeeContractType = this.employeeContractTypeList.find(
        ({ employeeContractTypeId }) => employeeContractTypeId === this.employeeContract.employeeContractTypeId
      )
      if (employeeContractType?.employeeContractTypeSlug === 'permanent') {
        this.isContractPermanent = true
      }
    },
    capitalizeFirstLetter(text: string) {
      if (!text) return ''
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
  }
})