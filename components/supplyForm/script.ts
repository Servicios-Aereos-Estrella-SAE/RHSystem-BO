import { defineComponent, ref, watch, toRaw, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import type { PropType } from 'vue'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import type { SupplyCharacteristicValueInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicValueInterface'
import SupplyService from '~/resources/scripts/services/SupplyService'
import SupplyCharacteristicService from '~/resources/scripts/services/SupplyCharacteristicService'
import SupplyCharacteristicValueService from '~/resources/scripts/services/SupplyCharacteristicValueService'
import { SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/SupplyStatus'

export default defineComponent({
  name: 'supplyForm',
  props: {
    supply: { type: Object as PropType<SupplyInterface>, required: true },
    supplyTypeId: { type: Number, required: true },
    clickOnSave: { type: Function, default: null },
    clickOnClose: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const toast = useToast()

    // 🧱 Servicios
    const supplyService = new SupplyService()
    const supplyCharacteristicService = new SupplyCharacteristicService()
    const supplyCharacteristicValueService = new SupplyCharacteristicValueService()

    // ⚙️ Estado reactivo
    const submitted = ref(false)
    const isLoading = ref(false)
    const displayForm = ref(false)
    const characteristicDateEditModes = ref<Record<number, boolean>>({})
    const supplyStatusOptions = SUPPLY_STATUS_OPTIONS
    const supplyCharacteristics = ref<SupplyCharacteristicInterface[]>([])
    const characteristicValues = ref<SupplyCharacteristicValueInterface[]>([])
    const allFileNumbers = ref<number[]>([])
    const booleanOptions = [
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' },
    ]

    // Computed para manejar la conversión de número a string
    const supplyFileNumberDisplay = computed({
      get: () => props.supply.supplyFileNumber?.toString() || '',
      set: (value: string) => {
        props.supply.supplyFileNumber = value ? Number(value) : 0
      }
    })

    watch(
      () => props.supply.supplyFileNumber,
      async (newValue) => {
        if (newValue) {
          await validateSupplyFileNumber(newValue)
        }
      }
    )

    // 🧩 Carga inicial
    onMounted(async () => {
      await loadAllFileNumbers()
      if (props.supply.supplyId) {
        await loadSupplyCharacteristics()
        await loadCharacteristicValues()
      }
    })


    async function loadAllFileNumbers() {
      try {
        const response = await supplyService.getAll()
        if ((response as any).type === 'success') {
          const data = (response as any).data
          const all = data.supplies?.data || []
          allFileNumbers.value = all
            .map((s: any) => Number(s.supplyFileNumber))
            .filter(Boolean)
        }
      } catch (error) {
        console.error('Error loading all file numbers:', error)
      }
    }

    function generateUniqueFileNumber(): number {
      let next = 1
      while (allFileNumbers.value.includes(next)) {
        next++
      }
      return next
    }

    async function loadSupplyCharacteristics() {
      try {
        const response = await supplyCharacteristicService.getAll(
          1,
          100,
          props.supplyTypeId
        )
        if ((response as any).type === 'success') {
          const data = (response as any).data
          if (data?.supplieCharacteristics?.data) {
            supplyCharacteristics.value = data.supplieCharacteristics.data
          }
        }
      } catch (error) {
        console.error('Error loading supply characteristics:', error)
      }
    }

    async function loadCharacteristicValues() {
      if (!props.supply.supplyId) return
      try {
        const response = await supplyCharacteristicValueService.getBySupply(
          props.supply.supplyId
        )
        if ((response as any).type === 'success') {
          const data = (response as any).data
          if (data?.supplieCaracteristic?.data) {
            characteristicValues.value = data.supplieCaracteristic.data
          }
        }
      } catch (error) {
        console.error('Error loading characteristic values:', error)
      }
    }

    function getCharacteristicValue(characteristicId: number | null) {
      if (!characteristicId) {
        return {
          supplieCaracteristicValueId: null,
          supplieCaracteristicId: null,
          supplieId: props.supply.supplyId!,
          supplieCaracteristicValueValue: '',
          supplieCaracteristicValueCreatedAt: null,
          supplieCaracteristicValueUpdatedAt: null,
          deletedAt: null,
        }
      }

      let value = characteristicValues.value.find(
        (v) => v.supplieCaracteristicId === characteristicId
      )
      if (!value) {
        value = {
          supplieCaracteristicValueId: null,
          supplieCaracteristicId: characteristicId,
          supplieId: props.supply.supplyId!,
          supplieCaracteristicValueValue: '',
          supplieCaracteristicValueCreatedAt: null,
          supplieCaracteristicValueUpdatedAt: null,
          deletedAt: null,
        }
        characteristicValues.value.push(value)
      }
      return value
    }

    async function saveCharacteristicValues() {
      for (const value of characteristicValues.value) {
        try {
          if (value.supplieCaracteristicValueId) {
            await supplyCharacteristicValueService.update(
              value.supplieCaracteristicValueId,
              value
            )
          } else if (value.supplieCaracteristicValueValue) {
            await supplyCharacteristicValueService.create(value)
          }
        } catch (error) {
          console.error('Error saving characteristic value:', error)
        }
      }
    }

    // ✅ Validación del número en tiempo real
    async function validateSupplyFileNumber(number: number) {
      if (!number) return false

      //console.log('number', number)
      //console.log('allFileNumbers', allFileNumbers.value)
      //console.log('supply.supplyFileNumber', props.supply.supplyFileNumber)

      // No usar toRaw, incluye ya funciona bien con refs
      if (
        allFileNumbers.value.includes(number) &&
        !props.supply.supplyId // 👈 solo si es un nuevo supply
      ) {
        toast.add({
          severity: 'warn',
          summary: t('warning'),
          detail: t('supply_file_number_already_assigned'),
          life: 5000,
        })
        return false
      }

      return true
    }

    async function onSave() {
      submitted.value = true
      isLoading.value = true

      if (!props.supply.supplyFileNumber) {
        props.supply.supplyFileNumber = generateUniqueFileNumber()
      }

      if (!props.supply.supplyName || !props.supply.supplyFileNumber) {
        isLoading.value = false
        return
      }

      if (!props.supply.supplyId) {
        props.supply.supplyStatus = 'active'
      }

      const isDeactivation =
        props.supply.supplyStatus === 'inactive' ||
        props.supply.supplyStatus === 'lost' ||
        props.supply.supplyStatus === 'damaged'

      if (
        isDeactivation &&
        (!props.supply.supplyDeactivationReason ||
          !props.supply.supplyDeactivationDate)
      ) {
        isLoading.value = false
        return
      }

      try {
        let response

        props.supply.supplyTypeId = props.supplyTypeId

        if (props.supply.supplyId) {
          if (isDeactivation) {
            const deactivateResponse = await supplyService.deactivate(
              props.supply.supplyId,
              props.supply.supplyDeactivationReason!,
              props.supply.supplyDeactivationDate instanceof Date
                ? props.supply.supplyDeactivationDate.toISOString()
                : props.supply.supplyDeactivationDate || new Date().toISOString()
            )

            if ((deactivateResponse as any).type === 'success') {
              response = await supplyService.update(
                props.supply.supplyId,
                props.supply
              )
            } else {
              toast.add({
                severity: 'error',
                summary: t('error'),
                detail:
                  (deactivateResponse as any).message ||
                  t('error_deactivating_supply'),
                life: 5000,
              })
              isLoading.value = false
              return
            }
          } else {
            response = await supplyService.update(
              props.supply.supplyId,
              props.supply
            )
          }
        } else {
          response = await supplyService.create(props.supply)
        }

        if ((response as any).type === 'success') {
          if (characteristicValues.value.length > 0) {
            await saveCharacteristicValues()
          }

          toast.add({
            severity: 'success',
            summary: props.supply.supplyId
              ? t('supply_updated')
              : t('supply_created'),
            detail:
              (response as any).message || 'Insumo guardado correctamente',
            life: 5000,
          })

          props.clickOnSave?.(props.supply)
          emit('save', props.supply)
        }

      } catch (error) {
        console.error('Error saving supply:', error)
        toast.add({
          severity: 'warn',
          summary: t('error'),
          detail: t('error_saving_supply'),
          life: 5000,
        })
      } finally {
        isLoading.value = false
      }
    }

    function handlerClickOnClose() {
      props.clickOnClose?.()
    }

    // 📅 Funciones para manejo de fecha
    const supplyDeactivationDateDisplay = computed(() => {
      if (!props.supply.supplyDeactivationDate) return ''

      const date = props.supply.supplyDeactivationDate instanceof Date
        ? props.supply.supplyDeactivationDate
        : new Date(props.supply.supplyDeactivationDate)

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    })

    function onEditDate() {
      displayForm.value = true
    }

    function onSaveDate() {
      displayForm.value = false
    }

    function cancelEditDate() {
      displayForm.value = false
    }

    function onDeleteDate() {
      props.supply.supplyDeactivationDate = null
    }

    // 📅 Funciones para manejo de fechas de características
    function getCharacteristicDateEditMode(characteristicId: number | null): boolean {
      if (!characteristicId) return false
      return characteristicDateEditModes.value[characteristicId] || false
    }

    function getCharacteristicDateDisplay(characteristicId: number | null): string {
      if (!characteristicId) return ''
      const value = getCharacteristicValue(characteristicId)
      if (!value.supplieCaracteristicValueValue) return ''

      const date = new Date(value.supplieCaracteristicValueValue)
      if (isNaN(date.getTime())) return value.supplieCaracteristicValueValue

      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    function onEditCharacteristicDate(characteristicId: number | null) {
      if (!characteristicId) return
      characteristicDateEditModes.value[characteristicId] = true
    }

    function onSaveCharacteristicDate(characteristicId: number | null) {
      if (!characteristicId) return
      characteristicDateEditModes.value[characteristicId] = false
    }

    function cancelEditCharacteristicDate(characteristicId: number | null) {
      if (!characteristicId) return
      characteristicDateEditModes.value[characteristicId] = false
    }

    function onDeleteCharacteristicDate(characteristicId: number | null) {
      if (!characteristicId) return
      const value = getCharacteristicValue(characteristicId)
      value.supplieCaracteristicValueValue = ''
    }

    // 🔹 Return para template
    return {
      t,
      toast,
      submitted,
      isLoading,
      displayForm,
      supplyStatusOptions,
      supplyCharacteristics,
      characteristicValues,
      allFileNumbers,
      booleanOptions,
      supplyFileNumberDisplay,
      supplyDeactivationDateDisplay,
      validateSupplyFileNumber,
      onSave,
      handlerClickOnClose,
      getCharacteristicValue,
      onEditDate,
      onSaveDate,
      cancelEditDate,
      onDeleteDate,
      getCharacteristicDateEditMode,
      getCharacteristicDateDisplay,
      onEditCharacteristicDate,
      onSaveCharacteristicDate,
      cancelEditCharacteristicDate,
      onDeleteCharacteristicDate,
    }
  },
})
