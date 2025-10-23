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
