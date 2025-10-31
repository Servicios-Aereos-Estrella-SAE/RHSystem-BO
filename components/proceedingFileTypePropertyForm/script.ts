import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast'
import { useMyGeneralStore } from '~/store/general'
import { ProceedingFileTypePropertyType } from '~/resources/scripts/enums/ProceedingFileTypePropertyType'
import ProceedingFileTypePropertyService from '~/resources/scripts/services/ProceedingFileTypePropertyService'

export default defineComponent({
  name: 'proceedingFileTypePropertyForm',
  props: {
    proceedingFileTypeId: { type: Number, required: true }
  },
  emits: ['onSave', 'onCancel'],
  data: () => ({
    form: {
      proceedingFileTypePropertyName: '',
      proceedingFileTypePropertyType: '',
      proceedingFileTypeId: 0
    },
    submitted: false,
    loading: false,
    propertyTypeOptions: [
      { label: 'Text', value: ProceedingFileTypePropertyType.TEXT },
      { label: 'File', value: ProceedingFileTypePropertyType.FILE },
      { label: 'Currency', value: ProceedingFileTypePropertyType.CURRENCY },
      { label: 'Decimal', value: ProceedingFileTypePropertyType.DECIMAL },
      { label: 'Number', value: ProceedingFileTypePropertyType.NUMBER }
    ]
  }),
  mounted() {
    this.form.proceedingFileTypeId = this.proceedingFileTypeId
  },
  methods: {
    async onSave() {
      this.submitted = true

      if (!this.form.proceedingFileTypePropertyName.trim() || !this.form.proceedingFileTypePropertyType) {
        return
      }

      this.loading = true
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      try {
        const proceedingFileTypePropertyService = new ProceedingFileTypePropertyService()
        const response = await proceedingFileTypePropertyService.store(this.form)

        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: this.$t('success'),
            detail: this.$t('property_created_successfully'),
            life: 3000,
          })

          this.$emit('onSave', response._data.data)
          this.resetForm()
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error'),
            detail: response._data?.message || this.$t('error_creating_property'),
            life: 5000,
          })
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('error_creating_property'),
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
      this.form.proceedingFileTypePropertyName = ''
      this.form.proceedingFileTypePropertyType = ''
      this.submitted = false
    }
  }
})
