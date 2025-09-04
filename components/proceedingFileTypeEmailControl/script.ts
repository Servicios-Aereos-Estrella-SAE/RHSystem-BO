import { defineComponent } from 'vue'
import { useMyGeneralStore } from '~/store/general'
import type { ProceedingFileTypeEmailInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeEmailInterface'
import ProceedingFileTypeEmailService from '~/resources/scripts/services/ProceedingFileTypeEmailService'
import UserService from '~/resources/scripts/services/UserService'

export default defineComponent({
  components: {
  },
  name: 'proceedingFileTypeEmailControl',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    proceedingFileTypeEmail: { type: Object as PropType<ProceedingFileTypeEmailInterface>, required: true },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
    currentProceedingFileTypeEmail: null as ProceedingFileTypeEmailInterface | null,
    displayForm: false as boolean,
    submitted: false as boolean,
    isEmailInvalid: false,
  }),
  computed: {
    getEmail() {
      return this.currentProceedingFileTypeEmail ? this.currentProceedingFileTypeEmail.proceedingFileTypeEmailEmail : ''
    }
  },
  async mounted() {
    this.currentProceedingFileTypeEmail = this.proceedingFileTypeEmail
    if (!this.currentProceedingFileTypeEmail.proceedingFileTypeEmailId) {
      this.displayForm = true
    }
  },
  methods: {
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    async handlerClickOnSave() {
      this.submitted = true
      this.isEmailInvalid = false
      const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()

      if (!(this.currentProceedingFileTypeEmail?.proceedingFileTypeEmailEmail)) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (this.currentProceedingFileTypeEmail.proceedingFileTypeEmailEmail) {
        const userService = new UserService()
        if (!userService.validateEmail(this.currentProceedingFileTypeEmail.proceedingFileTypeEmailEmail)) {
          this.isEmailInvalid = true
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: `${this.t('email')} ${this.t('is_not_valid')}`,
            life: 5000,
          })
          return
        }
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let proceedingFileTypeEmailResponse = null

      if (!this.currentProceedingFileTypeEmail.proceedingFileTypeEmailId) {
        proceedingFileTypeEmailResponse = await proceedingFileTypeEmailService.store(this.currentProceedingFileTypeEmail)
      } else {
        proceedingFileTypeEmailResponse = await proceedingFileTypeEmailService.update(this.currentProceedingFileTypeEmail)
      }

      if (proceedingFileTypeEmailResponse.status === 201 || proceedingFileTypeEmailResponse.status === 200) {
        proceedingFileTypeEmailResponse = await proceedingFileTypeEmailService.show(proceedingFileTypeEmailResponse._data.data.proceedingFileTypeEmail.proceedingFileTypeEmailId)
        if (proceedingFileTypeEmailResponse.status === 200) {
          const proceedingFileTypeEmail = proceedingFileTypeEmailResponse._data.data.proceedingFileTypeEmail.proceedingFileTypeEmail as ProceedingFileTypeEmailInterface
          this.currentProceedingFileTypeEmail = proceedingFileTypeEmail
          this.displayForm = false
        }
      } else {
        let msgError = proceedingFileTypeEmailResponse._data.error ? proceedingFileTypeEmailResponse._data.error : proceedingFileTypeEmailResponse._data.message
        const severityType = proceedingFileTypeEmailResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `${this.t('proceeding_file_type_email')} ${this.currentProceedingFileTypeEmail.proceedingFileTypeEmailId ? this.t('updated') : this.t('created')}`,
          detail: msgError,
          life: 5000,
        })
      }

      myGeneralStore.setFullLoader(false)
    }
  }
})