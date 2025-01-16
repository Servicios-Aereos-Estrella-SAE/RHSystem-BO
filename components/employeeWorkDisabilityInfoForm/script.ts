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
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';
import type { WorkDisabilityNoteInterface } from '~/resources/scripts/interfaces/WorkDisabilityNoteInterface';
import WorkDisabilityNoteService from '~/resources/scripts/services/WorkDisabilityNoteService';
import WorkDisabilityPeriodService from '~/resources/scripts/services/WorkDisabilityPeriodService';

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
    workDisabilityNotesList: [] as WorkDisabilityNoteInterface[],
    submitted: false,
    currentWorkDisability: null as WorkDisabilityInterface | null,
    isNewWorkDisability: false,
    isReady: false,
    isDeleted: false,
    drawerWorkDisabilityPeriodForm: false,
    drawerWorkDisabilityPeriodDelete: false,
    workDisabilityPeriod: null as WorkDisabilityPeriodInterface | null,
    drawerWorkDisabilityNoteForm: false,
    drawerWorkDisabilityNoteDelete: false,
    workDisabilityNote: null as WorkDisabilityNoteInterface | null,
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
        this.workDisabilityNotesList = workDisabilityResponse._data.data.workDisability.workDisabilityNotes
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
          this.$emit('onWorkDisabilitySave', workDisability as WorkDisabilityInterface, [])
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
    onSavePeriod(workDisabilityPeriod: WorkDisabilityPeriodInterface, shiftExceptionsError: Array<ShiftExceptionErrorInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      myGeneralStore.workDisabilityId = workDisabilityPeriod.workDisabilityId
      this.workDisabilityPeriod = { ...workDisabilityPeriod }
      const index = this.workDisabilityPeriodsList.findIndex((workDisabilityPeriod: WorkDisabilityPeriodInterface) => workDisabilityPeriod.workDisabilityPeriodId === this.workDisabilityPeriod?.workDisabilityPeriodId)
      if (index !== -1) {
        this.workDisabilityPeriodsList[index] = workDisabilityPeriod
        this.$forceUpdate()
      } else {
        this.workDisabilityPeriodsList.push(workDisabilityPeriod)
        this.$forceUpdate()
      }
      this.$emit('save',workDisabilityPeriod, shiftExceptionsError)
      this.drawerWorkDisabilityPeriodForm = false
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    onEditPeriod(workDisabilityPeriod: WorkDisabilityPeriodInterface) {
      this.workDisabilityPeriod = { ...workDisabilityPeriod }
      this.drawerWorkDisabilityPeriodForm = true
    },
    onDeletePeriod(workDisabilityPeriod: WorkDisabilityPeriodInterface) {
      this.workDisabilityPeriod = { ...workDisabilityPeriod }

      this.drawerWorkDisabilityPeriodDelete = true
    },
    async confirmDeletePeriod() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.workDisabilityPeriod) {
        myGeneralStore.workDisabilityId = this.workDisabilityPeriod.workDisabilityId
        this.drawerWorkDisabilityPeriodDelete = false
        const workDisabilityPeriodService = new WorkDisabilityPeriodService()
        const workDisabilityPeriodResponse = await workDisabilityPeriodService.delete(this.workDisabilityPeriod)
        if (workDisabilityPeriodResponse.status === 200) {
          const index = this.workDisabilityPeriodsList.findIndex((workDisabilityPeriod: WorkDisabilityPeriodInterface) => workDisabilityPeriod.workDisabilityPeriodId === this.workDisabilityPeriod?.workDisabilityPeriodId)
          if (index !== -1) {
            this.workDisabilityPeriodsList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$emit('onWorkDisabilitySave', {} as WorkDisabilityInterface, [])
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete work disability period',
            detail: workDisabilityPeriodResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    addNewNote() {
      const newWorkDisabilityNote = {
        workDisabilityId: this.workDisability.workDisabilityId
      } as WorkDisabilityNoteInterface
      this.workDisabilityNote = newWorkDisabilityNote
      this.drawerWorkDisabilityNoteForm = true
    },
    onSaveNote(workDisabilityNote: WorkDisabilityNoteInterface) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.workDisabilityNote = { ...workDisabilityNote }
      const index = this.workDisabilityNotesList.findIndex((workDisabilityNote: WorkDisabilityNoteInterface) => workDisabilityNote.workDisabilityNoteId === this.workDisabilityNote?.workDisabilityNoteId)
      if (index !== -1) {
        this.workDisabilityNotesList[index] = workDisabilityNote
        this.$forceUpdate()
      } else {
        this.workDisabilityNotesList.push(workDisabilityNote)
        this.$forceUpdate()
      }
      //this.$emit('save',workDisabilityNote)
      this.drawerWorkDisabilityNoteForm = false
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    onEditNote(workDisabilityNote: WorkDisabilityNoteInterface) {
      this.workDisabilityNote = { ...workDisabilityNote }
      this.drawerWorkDisabilityNoteForm = true
    },
    onDeleteNote(workDisabilityNote: WorkDisabilityNoteInterface) {
      this.workDisabilityNote = { ...workDisabilityNote }

      this.drawerWorkDisabilityNoteDelete = true
    },
    async confirmDeleteNote() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.workDisabilityNote) {
        this.drawerWorkDisabilityNoteDelete = false
        const workDisabilityNoteService = new WorkDisabilityNoteService()
        const workDisabilityNoteResponse = await workDisabilityNoteService.delete(this.workDisabilityNote)
        if (workDisabilityNoteResponse.status === 200) {
          const index = this.workDisabilityNotesList.findIndex((workDisabilityNote: WorkDisabilityNoteInterface) => workDisabilityNote.workDisabilityNoteId === this.workDisabilityNote?.workDisabilityNoteId)
          if (index !== -1) {
            this.workDisabilityNotesList.splice(index, 1)
            this.$forceUpdate()
          }
          //this.$emit('save', [])
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete work disability note',
            detail: workDisabilityNoteResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})