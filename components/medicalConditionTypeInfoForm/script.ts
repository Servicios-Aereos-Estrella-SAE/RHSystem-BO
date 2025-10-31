import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { MedicalConditionTypeInterface, MedicalConditionTypePropertyInterface } from '~/resources/scripts/interfaces/MedicalConditionTypeInterface'
import MedicalConditionTypeService from '~/resources/scripts/services/MedicalConditionTypeService'
import MedicalConditionTypePropertyService from '~/resources/scripts/services/MedicalConditionTypePropertyService'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import confirmDelete from '~/components/confirmDelete/index.vue'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    confirmDelete,
  },
  name: 'MedicalConditionTypeInfoForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    medicalConditionType: {
      type: Object as PropType<MedicalConditionTypeInterface>,
      required: true
    },
    clickOnSave: { type: Function, default: null }
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    currenMedicalConditionType: null as MedicalConditionTypeInterface | null,
    isNewMedicalConditionType: false,
    isReady: false,
    drawerPropertyDelete: false,
    propertyToDelete: null as { property: MedicalConditionTypePropertyInterface, index: number } | null,
    canUpdate: true,
  }),
  async mounted() {
    this.isReady = false
    this.isNewMedicalConditionType = !this.medicalConditionType.medicalConditionTypeId ? true : false
    let isActive: number = 1
    isActive = this.medicalConditionType.medicalConditionTypeActive ? this.medicalConditionType.medicalConditionTypeActive : 0
    this.activeSwicht = isActive === 1 ? true : false
    this.isReady = true
  },
  methods: {
    addProperty() {
      if (!this.medicalConditionType.properties) {
        this.medicalConditionType.properties = []
      }

      this.medicalConditionType.properties.push({
        medicalConditionTypePropertyName: '',
        medicalConditionTypePropertyDescription: '',
        medicalConditionTypePropertyDataType: 'TEXT',
        medicalConditionTypePropertyRequired: 0,
        medicalConditionTypeId: this.medicalConditionType.medicalConditionTypeId || 0,
        medicalConditionTypePropertyActive: 1
      })
    },
    removeProperty(index: number) {
      if (this.medicalConditionType.properties && this.medicalConditionType.properties[index]) {
        this.propertyToDelete = {
          property: this.medicalConditionType.properties[index],
          index: index
        }
        this.drawerPropertyDelete = true
      }
    },
    onCancelPropertyDelete() {
      this.drawerPropertyDelete = false
      this.propertyToDelete = null
    },
    async confirmDeleteProperty() {
      if (this.propertyToDelete && this.propertyToDelete.property.medicalConditionTypePropertyId) {
        this.drawerPropertyDelete = false
        const medicalConditionTypePropertyService = new MedicalConditionTypePropertyService()
        const response = await medicalConditionTypePropertyService.delete(this.propertyToDelete.property)

        if (response.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_medical_condition_type_property'),
            detail: response._data.message,
            life: 5000,
          })
          // Eliminar de la lista local
          if (this.medicalConditionType.properties) {
            this.medicalConditionType.properties.splice(this.propertyToDelete.index, 1)
            this.$forceUpdate()
          }
        } else {
          const severityType = response.status === 500 ? 'error' : 'warn'
          const msgError = response._data.error ? response._data.error : response._data.message
          this.$toast.add({
            severity: severityType,
            summary: this.t('delete_medical_condition_type_property'),
            detail: msgError,
            life: 5000,
          })
        }
      } else if (this.propertyToDelete) {
        // Si no tiene ID, es una propiedad nueva que solo se elimina localmente
        this.drawerPropertyDelete = false
        if (this.medicalConditionType.properties) {
          this.medicalConditionType.properties.splice(this.propertyToDelete.index, 1)
          this.$forceUpdate()
        }
      }
      this.propertyToDelete = null
    },
    async onSave() {
      this.submitted = true

      if (!this.medicalConditionType.medicalConditionTypeName) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if (!new MedicalConditionTypeService().validateInfo(this.medicalConditionType)) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      try {
        // Actualizar el estado activo
        this.medicalConditionType.medicalConditionTypeActive = this.activeSwicht ? 1 : 0

        // Actualizar el estado activo de las propiedades
        if (this.medicalConditionType.properties) {
          this.medicalConditionType.properties.forEach(property => {
            property.medicalConditionTypePropertyActive = 1 // Siempre activo
            property.medicalConditionTypePropertyRequired = property.medicalConditionTypePropertyRequired ? 1 : 0
          })
        }

        const medicalConditionTypeService = new MedicalConditionTypeService()
        const medicalConditionTypePropertyService = new MedicalConditionTypePropertyService()

        // Primero crear/actualizar el tipo médico
        let response
        if (this.isNewMedicalConditionType) {
          response = await medicalConditionTypeService.store(this.medicalConditionType)
        } else {
          response = await medicalConditionTypeService.update(this.medicalConditionType)
        }

        if (response.status === 200 || response.status === 201) {
          // Obtener el ID del tipo médico creado/actualizado
          const medicalConditionTypeId = response._data?.data?.medicalConditionTypeId || this.medicalConditionType.medicalConditionTypeId

          // Ahora manejar las propiedades por separado
          if (this.medicalConditionType.properties && this.medicalConditionType.properties.length > 0) {
            for (const property of this.medicalConditionType.properties) {
              property.medicalConditionTypeId = medicalConditionTypeId

              if (property.medicalConditionTypePropertyId) {
                // Actualizar propiedad existente
                await medicalConditionTypePropertyService.update(property)
              } else {
                // Crear nueva propiedad
                await medicalConditionTypePropertyService.store(property)
              }
            }
          }

          this.$toast.add({
            severity: 'success',
            summary: `Tipo de condición médica ${this.medicalConditionType.medicalConditionTypeId ? this.t('updated') : this.t('created')}`,
            detail: response._data.message,
            life: 5000,
          })

          if (this.clickOnSave) {
            this.clickOnSave(response._data.data)
          }
        } else {
          const severityType = response.status === 500 ? 'error' : 'warn'
          const msgError = response._data.error ? response._data.error : response._data.message
          this.$toast.add({
            severity: severityType,
            summary: `Tipo de condición médica ${this.medicalConditionType.medicalConditionTypeId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
        }
      } catch (error) {
        console.error('Error saving medical condition type:', error)
        this.$toast.add({
          severity: 'error',
          summary: `Tipo de condición médica`,
          detail: 'Error al guardar el tipo de condición médica',
          life: 5000,
        })
      }
    }
  }
})
