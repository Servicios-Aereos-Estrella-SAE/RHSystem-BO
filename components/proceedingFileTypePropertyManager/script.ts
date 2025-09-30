import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast'
import { useMyGeneralStore } from '~/store/general'
import ProceedingFileTypePropertyService from '~/resources/scripts/services/ProceedingFileTypePropertyService'

export default defineComponent({
  name: 'proceedingFileTypePropertyManager',
  props: {
    proceedingFileTypeId: { type: Number, required: true },
    canManageFiles: { type: Boolean, default: false, required: true }
  },
  emits: ['onPropertyAdded', 'onPropertyDeleted'],
  data: () => ({
    properties: [] as any[],
    showAddForm: false
  }),
  async mounted() {
    await this.loadProperties()
  },
  methods: {
    async loadProperties() {
      try {
        const proceedingFileTypePropertyService = new ProceedingFileTypePropertyService()
        const response = await proceedingFileTypePropertyService.getByProceedingFileType(this.proceedingFileTypeId)
        this.properties = response._data?.data || []
      } catch (error) {
        console.error('Error loading properties:', error)
      }
    },

    showAddPropertyForm() {
      this.showAddForm = true
    },

    async onPropertySave(newProperty: any) {
      this.properties.push(newProperty)
      this.showAddForm = false
      this.$emit('onPropertyAdded', newProperty)
    },

    onPropertyCancel() {
      this.showAddForm = false
    },

    async deleteProperty(property: any) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      try {
        const proceedingFileTypePropertyService = new ProceedingFileTypePropertyService()
        const response = await proceedingFileTypePropertyService.delete(property.proceedingFileTypePropertyId)

        if (response.status === 200 || response.status === 204) {
          const index = this.properties.findIndex(p => p.proceedingFileTypePropertyId === property.proceedingFileTypePropertyId)
          if (index !== -1) {
            this.properties.splice(index, 1)
          }

          this.$toast.add({
            severity: 'success',
            summary: this.$t('success'),
            detail: this.$t('property_deleted_successfully'),
            life: 3000,
          })

          this.$emit('onPropertyDeleted', property)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error'),
            detail: response._data?.message || this.$t('error_deleting_property'),
            life: 5000,
          })
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('error_deleting_property'),
          life: 5000,
        })
      } finally {
        myGeneralStore.setFullLoader(false)
      }
    }
  }
})
