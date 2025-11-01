import { defineComponent, ref, onMounted, watch } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import { EMPLOYEE_SUPPLY_STATUS_OPTIONS, EMPLOYEE_SUPPLY_STATUS_OPTIONS_EN } from '~/resources/scripts/enums/EmployeeSupplyStatus'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import SupplyService from '~/resources/scripts/services/SupplyService'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'

export default defineComponent({
  name: 'assignmentCard',
  props: {
    assignment: { type: Object as PropType<EmployeeSupplyInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },

  setup(props) {
    const { t, locale } = useI18n()
    const employeeService = new EmployeeService()
    const supplyService = new SupplyService()
    const employeeFullName = ref<string>(t('not_assigned'))
    const employeePhoto = ref<string | null>(null)
    const supplyName = ref<string>(t('not_assigned'))
    const isLoading = ref(false)
    const supply = ref<SupplyInterface | null>(null)
    const supplyFileNumber = ref<number | null>(null)

    /** 🔹 Cargar empleado asignado */
    const loadEmployee = async () => {
      if (!props.assignment?.employeeId) {
        employeeFullName.value = t('not_assigned')
        employeePhoto.value = null
        return
      }

      try {
        isLoading.value = true
        const response = await employeeService.show(props.assignment.employeeId)

        if (response?.status === 200) {
          const emp = response._data?.data?.employee
          employeeFullName.value = `${emp.employeeFirstName} ${emp.employeeLastName} ${emp.employeeSecondLastName || ''}`.trim()
          employeePhoto.value = emp.employeePhoto || null
          const supplyResponse = await supplyService.getById(props.assignment.supplyId)
          if (supplyResponse && (supplyResponse as any).status === 'success') {
            supply.value = (supplyResponse as any).data?.data?.supplie || null
            supplyFileNumber.value = (supplyResponse as any).data?.data?.supplie?.supplyFileNumber || null
          }
        } else {
          employeeFullName.value = t('not_assigned')
        }
      } catch (err) {
        console.error('Error loading employee:', err)
        employeeFullName.value = t('not_assigned')
      } finally {
        isLoading.value = false
      }
    }

    /** 🔹 Observar cambios en el assignment */
    watch(
      () => props.assignment.employeeId,
      () => loadEmployee(),
      { immediate: true }
    )

    onMounted(() => {
      loadEmployee()
      loadSupply()
    })

    const loadSupply = async () => {
      if (!props.assignment?.supplyId) {
        supplyName.value = t('not_assigned')
        return
      }

      try {
        const supplyResponse: any = await supplyService.getById(props.assignment.supplyId)

        if (supplyResponse && supplyResponse.type === 'success') {
          const supplie = supplyResponse.data?.supplie
          supply.value = supplie
          supplyName.value = supplie?.supplyName || t('not_assigned')
          supplyFileNumber.value = supplie?.supplyFileNumber || null
        } else {
          supplyName.value = t('not_assigned')
        }
      } catch (error) {
        console.error('Error loading supply:', error)
        supplyName.value = t('not_assigned')
      }
    }


    /** 🔹 Métodos de ayuda */
    const getStatusClass = (status: string) => {
      const classes: Record<string, string> = {
        active: 'status-active',
        retired: 'status-retired',
        shipping: 'status-shipping',
      }
      return classes[status] || 'status-unknown'
    }

    const getStatusLabel = (status: string) => {
      const lang = (locale?.value || 'es').toString().toLowerCase()
      const options = lang.startsWith('en') ? EMPLOYEE_SUPPLY_STATUS_OPTIONS_EN : EMPLOYEE_SUPPLY_STATUS_OPTIONS
      const opt = options.find(o => o.value === status)
      return opt ? opt.label : status
    }

    const formatDate = (date: Date | string | null) => {
      if (!date) return '---'

      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date

        // Verificar que la fecha es válida
        if (isNaN(dateObj.getTime())) return '---'

        // Extraer año, mes y día y formatear como YYYY-MM-DD
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
      } catch (error) {
        console.error('Error formatting date:', error)
        return '---'
      }
    }

    const getExpirationStatus = computed(() => {
      const expirationDate = props.assignment?.employeeSupplyExpirationDate
      if (!expirationDate) return null

      const expiration = new Date(expirationDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      expiration.setHours(0, 0, 0, 0)

      const diffTime = expiration.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        return {
          text: t('expired'),
          class: 'expired',
          days: null
        }
      } else {
        return {
          text: diffDays === 0 ? t('expires_today') : t('days_remaining', { days: diffDays }),
          class: diffDays <= 7 ? 'warning' : diffDays <= 30 ? 'caution' : 'ok',
          days: diffDays
        }
      }
    })

    const assignmentInitial = computed(() => {
      const name = employeeFullName.value
      return name ? name.charAt(0).toUpperCase() : 'N'
    })

    /** 🔹 Acciones */
    const handlerClickOnEdit = () => {
      if (props.clickOnEdit && props.assignment) props.clickOnEdit(props.assignment)
    }

    const handlerClickOnDelete = () => {
      if (props.clickOnDelete && props.assignment) props.clickOnDelete(props.assignment)
    }

    return {
      t,
      employeeFullName,
      employeePhoto,
      isLoading,
      assignmentInitial,
      getStatusClass,
      getStatusLabel,
      formatDate,
      getExpirationStatus,
      handlerClickOnEdit,
      handlerClickOnDelete,
      supply,
      supplyName,
      supplyFileNumber,
    }
  },
})
