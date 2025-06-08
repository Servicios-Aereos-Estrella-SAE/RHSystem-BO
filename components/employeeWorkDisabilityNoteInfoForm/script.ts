import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { WorkDisabilityNoteInterface } from '~/resources/scripts/interfaces/WorkDisabilityNoteInterface';
import WorkDisabilityNoteService from '~/resources/scripts/services/WorkDisabilityNoteService';
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'WorkDisabilityNoteInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    workDisabilityNote: { type: Object as PropType<WorkDisabilityNoteInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    submitted: false,
    isNewWorkDisabilityNote: false,
    isReady: false,
    isDeleted: false,
    files: [] as Array<any>,
    dates: [],
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewWorkDisabilityNote = !this.workDisabilityNote.workDisabilityNoteId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }

    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async onSave() {
      this.submitted = true
      const workDisabilityNoteService = new WorkDisabilityNoteService()
      if (!this.workDisabilityNote.workDisabilityNoteDescription) {
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
      let workDisabilityNoteResponse = null
      if (!this.workDisabilityNote.workDisabilityNoteId) {
        workDisabilityNoteResponse = await workDisabilityNoteService.store(this.workDisabilityNote)
      } else {
        workDisabilityNoteResponse = await workDisabilityNoteService.update(this.workDisabilityNote)
      }

      if (workDisabilityNoteResponse.status === 201 || workDisabilityNoteResponse.status === 200) {
        let shiftExceptionsError = [] as Array<ShiftExceptionErrorInterface>
        if (workDisabilityNoteResponse._data.data.shiftExceptionsError) {
          shiftExceptionsError = workDisabilityNoteResponse._data.data.shiftExceptionsError
        }
        workDisabilityNoteResponse = await workDisabilityNoteService.show(workDisabilityNoteResponse._data.data.workDisabilityNote.workDisabilityNoteId)
        if (workDisabilityNoteResponse.status === 200) {
          const workDisabilityNote = workDisabilityNoteResponse._data.data.workDisabilityNote


          this.$emit('onWorkDisabilityNoteSave', workDisabilityNote as WorkDisabilityNoteInterface, shiftExceptionsError as Array<ShiftExceptionErrorInterface>)
        }
      } else {
        const msgError = workDisabilityNoteResponse._data.error ? workDisabilityNoteResponse._data.error : workDisabilityNoteResponse._data.message
        const severityType = workDisabilityNoteResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Work disability ${this.workDisabilityNote.workDisabilityNoteId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
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
  }
})