export enum SupplyCharacteristicType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean'
}

export const SUPPLY_CHARACTERISTIC_TYPES = [
  { label: 'Texto', value: SupplyCharacteristicType.TEXT },
  { label: 'Número', value: SupplyCharacteristicType.NUMBER },
  { label: 'Fecha', value: SupplyCharacteristicType.DATE },
  { label: 'Booleano', value: SupplyCharacteristicType.BOOLEAN }
]

export const SUPPLY_CHARACTERISTIC_TYPES_EN = [
  { label: 'Text', value: SupplyCharacteristicType.TEXT },
  { label: 'Number', value: SupplyCharacteristicType.NUMBER },
  { label: 'Date', value: SupplyCharacteristicType.DATE },
  { label: 'Boolean', value: SupplyCharacteristicType.BOOLEAN }
]

export function getSupplyCharacteristicTypeOptions(language?: string) {
  let lang = (language || '').toLowerCase()
  if (!lang) {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('i18n_redirected') : null
      lang = (stored || 'es').toLowerCase()
    } catch {
      lang = 'es'
    }
  }
  if (lang.startsWith('en')) return SUPPLY_CHARACTERISTIC_TYPES_EN
  return SUPPLY_CHARACTERISTIC_TYPES
}
