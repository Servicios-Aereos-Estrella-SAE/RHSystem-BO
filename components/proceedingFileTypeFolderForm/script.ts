import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast'
import { useMyGeneralStore } from '~/store/general'
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService'

export default defineComponent({
  name: 'proceedingFileTypeFolderForm',
  props: {
    parentId: { type: Number, default: null }
  },
  emits: ['onSave', 'onCancel'],
  data: () => ({
    form: {
      proceedingFileTypeName: '',
      parentId: null as number | null,
      proceedingFileTypeActive: true
    },
    submitted: false,
    loading: false
  }),
  mounted() {
    this.form.parentId = this.parentId
  },
  methods: {
    async onSave() {
      this.submitted = true

      if (!this.form.proceedingFileTypeName.trim()) {
        return
      }

      this.loading = true
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      try {
        const proceedingFileTypeService = new ProceedingFileTypeService()
        const response = await proceedingFileTypeService.createEmployeeType(this.form)

        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: this.$t('success'),
            detail: this.$t('folder_created_successfully'),
            life: 3000,
          })

          this.resetForm()
          // Emitir después de resetear el formulario
          this.$nextTick(() => {
            // El API devuelve tanto la carpeta como la propiedad por defecto
            this.$emit('onSave', response._data.data.proceedingFileType)
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error'),
            detail: response._data?.message || this.$t('error_creating_folder'),
            life: 5000,
          })
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('error_creating_folder'),
          life: 5000,
        })
      } finally {
        this.loading = false
        myGeneralStore.setFullLoader(false)
      }
    },

    onCancel() {
      this.resetForm()
      this.$emit('onCancel')
    },

    resetForm() {
      this.form.proceedingFileTypeName = ''
      this.submitted = false
      this.loading = false
    }
  }
})
