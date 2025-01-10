import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import WorkDisabilityService from '~/resources/scripts/services/WorkDisabilityService';
import type { InsuranceCoverageTypeInterface } from '~/resources/scripts/interfaces/InsuranceCoverageTypeInterface';
import InsuranceCoverageTypeService from '~/resources/scripts/services/InsuranceCoverageTypeService';
import type { WorkDisabilityInterface } from '~/resources/scripts/interfaces/WorkDisabilityInterface';
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeWorkDisabilityInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    workDisability: { type: Object as PropType<WorkDisabilityInterface>, required: true },
    canManageWorkDisability: { type: Boolean, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    insuranceCoverageTypeList: [] as InsuranceCoverageTypeInterface[],
    workDisabilityPeriodsList: [] as WorkDisabilityPeriodInterface[],
    submitted: false,
    currentWorkDisability: null as WorkDisabilityInterface | null,
    isNewWorkDisability: false,
    isReady: false,
    isDeleted: false,
    drawerWorkDisabilityPeriodForm: false,
    workDisabilityPeriod: null as WorkDisabilityPeriodInterface | null,
  }),
  computed: {
  },
  watch: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewWorkDisability = !this.workDisability.workDisabilityId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    if (this.workDisability.workDisabilityId) {
      const workDisabilityService = new WorkDisabilityService()
      const workDisabilityResponse = await workDisabilityService.show(this.workDisability.workDisabilityId)

      if (workDisabilityResponse.status === 200) {
        this.currentWorkDisability = workDisabilityResponse._data.data.workDisability
        this.workDisabilityPeriodsList = workDisabilityResponse._data.data.workDisability.workDisabilityPeriods
      }
    }

    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    const exceptionType = hasAccess || this.employee.employeeTypeOfContract === 'External' ? '' : 'rest-day'
    this.insuranceCoverageTypeList = await this.getInsuranceCoverageTypes(exceptionType)
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getInsuranceCoverageTypes(search: string) {
      const response = await new InsuranceCoverageTypeService().getFilteredList(search, 1, 100)
      const list: InsuranceCoverageTypeInterface[] = response.status === 200 ? response._data.data.insuranceCoverageTypes.data : []
      return list
    },
    async onSave() {
      this.submitted = true
      const workDisabilityService = new WorkDisabilityService()

      if (!this.workDisability.insuranceCoverageTypeId) {
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
      let workDisabilityResponse = null


      let isNew = false
      if (!this.workDisability.workDisabilityId) {
        isNew = true
        workDisabilityResponse = await workDisabilityService.store(this.workDisability)
      } else {
        workDisabilityResponse = await workDisabilityService.update(this.workDisability)
      }

      if (workDisabilityResponse.status === 201 || workDisabilityResponse.status === 200) {
        workDisabilityResponse = await workDisabilityService.show(workDisabilityResponse._data.data.workDisability.workDisabilityId)
        if (workDisabilityResponse.status === 200) {
          const workDisability = workDisabilityResponse._data.data.workDisability
          this.$emit('onWorkDisabilitySave', workDisability as WorkDisabilityInterface)
        }
      } else {
        const msgError = workDisabilityResponse._data.error ? workDisabilityResponse._data.error : workDisabilityResponse._data.message
        const severityType = workDisabilityResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Work disability ${this.workDisability.workDisabilityId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }

      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    addNewPeriod() {
      const newWorkDisabilityPeriod = {
        workDisabilityId: this.workDisability.workDisabilityId
      } as WorkDisabilityPeriodInterface
      this.workDisabilityPeriod = newWorkDisabilityPeriod
      this.drawerWorkDisabilityPeriodForm = true
    },
    onSavePeriod(workDisabilityPeriod: WorkDisabilityPeriodInterface) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.workDisabilityPeriod = { ...workDisabilityPeriod }
      const index = this.workDisabilityPeriodsList.findIndex((workDisabilityPeriod: WorkDisabilityPeriodInterface) => workDisabilityPeriod.workDisabilityPeriodId === this.workDisabilityPeriod?.workDisabilityPeriodId)
      if (index !== -1) {
        this.workDisabilityPeriodsList[index] = workDisabilityPeriod
        this.$forceUpdate()
      } else {
        this.workDisabilityPeriodsList.push(workDisabilityPeriod)
        this.$forceUpdate()
      }
      this.$emit('save', [])
      this.drawerWorkDisabilityPeriodForm = false
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
  }
})