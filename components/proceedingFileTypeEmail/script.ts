import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { useMyGeneralStore } from '~/store/general'
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface'
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService'
import type { ProceedingFileTypeEmailInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeEmailInterface'
import ProceedingFileTypeEmailService from '~/resources/scripts/services/ProceedingFileTypeEmailService'

export default defineComponent({
  components: {
  },
  name: 'proceedingFileTypeEmail',
  props: {
    proceedingFileType: { type: Object as PropType<ProceedingFileTypeInterface>, required: true }
  },
  data: () => ({
    proceedingFileTypeEmails: [] as Array<ProceedingFileTypeEmailInterface>,
    legacyProceedingFileTypeEmails: [] as Array<ProceedingFileTypeEmailInterface>,
    isReady: false as boolean,
    displayForm: false as boolean,
    proceedingFileTypeEmail: null as ProceedingFileTypeEmailInterface | null,
    drawerProceedingFileTypeEmailDelete: false,
    emailToDelete: '',
    currentIndex: -1,
    countsNewVacation: 0,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    if (this.proceedingFileType.proceedingFileTypeId) {
      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse = await proceedingFileTypeService.show(this.proceedingFileType.proceedingFileTypeId)
      if (proceedingFileTypeResponse && proceedingFileTypeResponse.status === 200) {
        this.proceedingFileTypeEmails = proceedingFileTypeResponse._data.data.proceedingFileType.emails
      }
      const proceedingFileTypeEmailsResponse = await proceedingFileTypeService.getLegacyEmails(this.proceedingFileType.proceedingFileTypeId)
      if (proceedingFileTypeEmailsResponse && proceedingFileTypeEmailsResponse.status === 200) {
        this.legacyProceedingFileTypeEmails = proceedingFileTypeEmailsResponse._data.data.proceedingFileTypeEmails
      }
    }
    this.isReady = true
  },
  methods: {
    async addNewEmail() {
      const newProceedingFileTypeEmail = {
        proceedingFileTypeEmailId: null,
        proceedingFileTypeId: this.proceedingFileType.proceedingFileTypeId,
        proceedingFileTypeEmailEmail: '',
      } as ProceedingFileTypeEmailInterface
      this.proceedingFileTypeEmails.push(newProceedingFileTypeEmail)
    },
    onDelete(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface, currentIndex: number) {
      this.currentIndex = currentIndex
      this.proceedingFileTypeEmail = { ...proceedingFileTypeEmail }
      this.emailToDelete = ''
      if (this.proceedingFileTypeEmail && this.proceedingFileTypeEmail.proceedingFileTypeEmailEmail) {
        this.emailToDelete = this.proceedingFileTypeEmail.proceedingFileTypeEmailEmail
      }
      this.drawerProceedingFileTypeEmailDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let wasDeleteSuccessfully = false
      if (this.proceedingFileTypeEmail) {
        this.drawerProceedingFileTypeEmailDelete = false
        if (this.proceedingFileTypeEmail.proceedingFileTypeEmailId) {
          const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
          const proceedingFileTypeEmailResponse = await proceedingFileTypeEmailService.delete(this.proceedingFileTypeEmail)
          if (proceedingFileTypeEmailResponse.status === 200) {
            wasDeleteSuccessfully = true
            this.$toast.add({
              severity: 'success',
              summary: 'Delete email',
              detail: proceedingFileTypeEmailResponse._data.message,
              life: 5000,
            })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Delete email',
              detail: proceedingFileTypeEmailResponse._data.message,
              life: 5000,
            })
          }
        } else {
          wasDeleteSuccessfully = true
          this.$toast.add({
            severity: 'success',
            summary: 'Delete email',
            detail: 'Email was deleted successfully',
            life: 5000,
          })
        }
        if (wasDeleteSuccessfully) {
          if (this.currentIndex !== -1) {
            this.proceedingFileTypeEmails.splice(this.currentIndex, 1)
            this.$forceUpdate()
          }
        }
        this.currentIndex = -1
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})