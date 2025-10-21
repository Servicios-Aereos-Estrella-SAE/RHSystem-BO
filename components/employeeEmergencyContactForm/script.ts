import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeEmergencyContactInterface } from '~/resources/scripts/interfaces/EmployeeEmergencyContactInterface'
import EmployeeEmergencyContactService from '~/resources/scripts/services/EmployeeEmergencyContactService'

export default defineComponent({
  name: 'employeeEmergencyContactForm',
  props: {
    employeeEmergencyContact: {
      type: Object as PropType<EmployeeEmergencyContactInterface>,
      required: true
    },
    employeeId: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, default: false, required: true }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {} as EmployeeEmergencyContactInterface,
      submitted: false,
      isLoading: false
    }
  },
  computed: {
    isEditing() {
      return this.employeeEmergencyContact.employeeEmergencyContactId !== null
    }
  },
  watch: {
    employeeEmergencyContact: {
      handler(newVal) {
        this.formData = { ...newVal }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async onSave() {
      this.submitted = true
      this.isLoading = true

      const employeeEmergencyContactService = new EmployeeEmergencyContactService()

      // Validar que al menos un campo esté lleno
      const hasAtLeastOneField = employeeEmergencyContactService.hasAtLeastOneField(this.formData)

      if (!hasAtLeastOneField) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('validation_data'),
          detail: this.$t('at_least_one_field_required'),
          life: 5000,
        })
        this.isLoading = false
        return
      }

      // Validar campos requeridos
      if (!employeeEmergencyContactService.validateInfo(this.formData)) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('validation_data'),
          detail: this.$t('missing_data'),
          life: 5000,
        })
        this.isLoading = false
        return
      }

      try {
        let response = null

        if (this.isEditing) {
          response = await employeeEmergencyContactService.update(this.formData)
        } else {
          response = await employeeEmergencyContactService.store(this.formData)
        }

        if (response.status === 201 || response.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `${this.$t('emergency_contact')} ${this.isEditing ? this.$t('updated') : this.$t('created')}`,
            detail: response._data.message,
            life: 5000,
          })

          // Obtener el contacto actualizado
          const showResponse = await employeeEmergencyContactService.show(response._data.data.employeeEmergencyContact.employeeEmergencyContactId)
          if (showResponse.status === 200) {
            this.$emit('save', showResponse._data.data.employeeEmergencyContact.employeeEmergencyContact)
          }
        } else if (response.status === 400 || response.status === 404) {
          const msgError = response._data.error ? response._data.error : response._data.message
          this.$toast.add({
            severity: 'warn',
            summary: `${this.$t('emergency_contact')} ${this.isEditing ? this.$t('updated') : this.$t('created')}`,
            detail: msgError,
            life: 5000,
          })
        } else {
          const msgError = response._data.error ? response._data.error : response._data.message
          this.$toast.add({
            severity: 'error',
            summary: `${this.$t('emergency_contact')} ${this.isEditing ? this.$t('updated') : this.$t('created')}`,
            detail: msgError,
            life: 5000,
          })
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('unexpected_error'),
          life: 5000,
        })
      } finally {
        this.isLoading = false
      }
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
})
