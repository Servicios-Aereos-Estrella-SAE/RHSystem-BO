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
import { SUPPLY_STATUS_OPTIONS, SUPPLY_STATUS_OPTIONS_EN } from '~/resources/scripts/enums/SupplyStatus'

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
    const { t, locale } = useI18n()
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
    const supplyStatusOptions = computed(() => {
      const lang = (locale?.value || 'es').toString().toLowerCase()
      return lang.startsWith('en') ? SUPPLY_STATUS_OPTIONS_EN : SUPPLY_STATUS_OPTIONS
    })
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
      },
    })

    // Validar cuando cambie el número de archivo
    watch(
      () => props.supply.supplyFileNumber,
      async (newValue) => {
        if (newValue) {
          await validateSupplyFileNumber(newValue)
        }
      }
    )

    // Si cambia el supplyId (p. ej. abres otro supply en el mismo componente),
    // recargamos características y valores.
    watch(
      () => props.supply.supplyId,
      async (newId, oldId) => {
        if (newId && newId !== oldId) {
          await loadSupplyCharacteristics()
          await loadCharacteristicValues()
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
      // muestra lo que cargó (útil para debug)
      console.log('✅ supplyCharacteristics:', supplyCharacteristics.value)
      console.log('✅ characteristicValues:', characteristicValues.value)
    })

    // -------------------------
    // Funciones: carga / util
    // -------------------------

    // 🔹 Cargar números de archivo
    async function loadAllFileNumbers() {
      try {
        const response = await supplyService.getWithTrashed()
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
      while (allFileNumbers.value.includes(next)) next++
      return next
    }

    // 🔹 Cargar características del tipo de suministro
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
          } else if (data?.supplieCharacteristics) {
            supplyCharacteristics.value = data.supplieCharacteristics
          } else if (Array.isArray(data)) {
            // fallback por si devuelve directamente un array
            supplyCharacteristics.value = data
          }
        }
      } catch (error) {
        console.error('Error loading supply characteristics:', error)
      }
    }

    // 🔹 Cargar valores de características del suministro
    async function loadCharacteristicValues() {
      if (!props.supply.supplyId) {
        // limpiar por si no hay supply
        characteristicValues.value = []
        return
      }

      try {
        const response = await supplyCharacteristicValueService.getBySupply(
          props.supply.supplyId
        )

        if ((response as any).type === 'success') {
          const data = (response as any).data

          // === CORRECCIÓN SEGÚN TU API ===
          // Tu API devuelve los valores dentro de data.data (ver ejemplo que mostrabas).
          // También intentamos otros fallbacks por seguridad.
          const values =
            data?.data ||
            data?.supplieCaracteristicValues?.data ||
            data?.supplieCaracteristicValues ||
            data?.supplieCaracteristic?.data ||
            []

          // Normalizar: asegurarnos que los objetos tengan las propiedades esperadas
          // y que Vue trate la lista como reactiva (copiamos cada objeto).
          characteristicValues.value = values.map((v: any) => ({
            supplieCaracteristicValueId: v.supplieCaracteristicValueId ?? null,
            supplieCaracteristicId: v.supplieCaracteristicId ?? v?.supplieCaracteristic?.supplieCaracteristicId ?? null,
            supplieId: v.supplieId ?? props.supply.supplyId,
            supplieCaracteristicValueValue: v.supplieCaracteristicValueValue ?? v.value ?? '',
            supplieCaracteristicValueCreatedAt: v.supplieCaracteristicValueCreatedAt ?? null,
            supplieCaracteristicValueUpdatedAt: v.supplieCaracteristicValueUpdatedAt ?? null,
            deletedAt: v.deletedAt ?? null,
            // mantén la relación anidada si viene (útil para tipos)
            supplieCaracteristic: v.supplieCaracteristic ?? v.supplieCaracteristic
          }))
        }
      } catch (error) {
        console.error('Error loading characteristic values:', error)
      }
    }

    // -------------------------
    // get/create value handling
    // -------------------------

    // Obtener o crear valor de característica (sin duplicados)
    function getCharacteristicValue(characteristicId: number | null) {
      if (!characteristicId) {
        return {
          supplieCaracteristicValueId: null,
          supplieCaracteristicId: null,
          supplieId: props.supply.supplyId ?? null,
          supplieCaracteristicValueValue: '',
          supplieCaracteristicValueCreatedAt: null,
          supplieCaracteristicValueUpdatedAt: null,
          deletedAt: null,
        }
      }

      // buscar valor existente
      let value = characteristicValues.value.find(
        (v) => v && v.supplieCaracteristicId === characteristicId
      )

      if (!value) {
        // crear nuevo y empujarlo (solo si no existe)
        value = {
          supplieCaracteristicValueId: null,
          supplieCaracteristicId: characteristicId,
          supplieId: props.supply.supplyId ?? null,
          supplieCaracteristicValueValue: '',
          supplieCaracteristicValueCreatedAt: null,
          supplieCaracteristicValueUpdatedAt: null,
          deletedAt: null,
        }
        characteristicValues.value.push(value)
      }

      return value
    }

    // -------------------------
    // Guardado de valores
    // -------------------------

    async function saveCharacteristicValues() {
      for (const value of characteristicValues.value) {
        try {
          // si viene id => update
          if (value.supplieCaracteristicValueId) {
            await supplyCharacteristicValueService.update(
              value.supplieCaracteristicValueId,
              value
            )
          } else {
            // si no tiene id: sólo crear si hay valor (evita crear vacíos)
            if (
              value.supplieCaracteristicValueValue !== null &&
              value.supplieCaracteristicValueValue !== ''
            ) {
              await supplyCharacteristicValueService.create(value)
            }
          }
        } catch (error) {
          console.error('Error saving characteristic value:', error)
        }
      }
    }

    // -------------------------
    // Validaciones y save principal
    // -------------------------

    async function validateSupplyFileNumber(number: number) {
      if (!number) return false

      if (
        allFileNumbers.value.includes(number) &&
        !props.supply.supplyId // si es nuevo supply y el número ya existe
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

      try {
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

        let response: any
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
          // Guardar valores (create/update) sólo si hay elementos
          if (characteristicValues.value.length > 0) {
            await saveCharacteristicValues()
          }

          toast.add({
            severity: 'success',
            summary: props.supply.supplyId ? t('supply_updated') : t('supply_created'),
            detail: (response as any).message || 'Insumo guardado correctamente',
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

    // -------------------------
    // Fecha de baja y fechas de características
    // -------------------------

    function handlerClickOnClose() {
      props.clickOnClose?.()
    }

    const supplyDeactivationDateDisplay = computed(() => {
      if (!props.supply.supplyDeactivationDate) return ''
      const date =
        props.supply.supplyDeactivationDate instanceof Date
          ? props.supply.supplyDeactivationDate
          : new Date(props.supply.supplyDeactivationDate)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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

    // Fechas de características
    function getCharacteristicDateEditMode(characteristicId: number | null): boolean {
      if (!characteristicId) return false
      return characteristicDateEditModes.value[characteristicId] || false
    }

    function getCharacteristicDateDisplay(characteristicId: number | null): string {
      if (!characteristicId) return ''
      const value = getCharacteristicValue(characteristicId)
      if (!value || !value.supplieCaracteristicValueValue) return ''
      const date = new Date(value.supplieCaracteristicValueValue)
      if (isNaN(date.getTime())) return value.supplieCaracteristicValueValue
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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

    // -------------------------
    // Return (para template)
    // -------------------------
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
