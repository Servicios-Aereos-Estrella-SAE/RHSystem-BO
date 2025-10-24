import { defineComponent, ref, onMounted, watch } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import { EMPLOYEE_SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/EmployeeSupplyStatus'
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
    const { t } = useI18n()
    const employeeService = new EmployeeService()
    const supplyService = new SupplyService()
    const employeeFullName = ref<string>(t('not_assigned'))
    const employeePhoto = ref<string | null>(null)
    const supplyName = ref<string>(t('not_assigned'))
    const isLoading = ref(false)

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
          if (supplyResponse && (supplyResponse as any).status === 200) {
            supplyName.value = (supplyResponse as any).data?.supply?.supplyName || t('not_assigned')
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
      const supplyResponse = await supplyService.getById(props.assignment.supplyId)
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
      const opt = EMPLOYEE_SUPPLY_STATUS_OPTIONS.find(o => o.value === status)
      return opt ? opt.label : status
    }

    const formatDate = (date: Date | string | null) => {
      if (!date) return '---'
      return new Date(date).toLocaleDateString()
    }

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
      handlerClickOnEdit,
      handlerClickOnDelete,
    }
  },
})
