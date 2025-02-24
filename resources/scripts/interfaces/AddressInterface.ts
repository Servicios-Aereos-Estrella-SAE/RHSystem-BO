interface AddressInterface {
  addressId: number | null
  addressZipcode: number | null
  addressCountry: string
  addressState: string
  addressTownship: string
  addressCity: string
  addressSettlement: string
  addressSettlementType: string
  addressStreet: string
  addressInternalNumber: string
  addressExternalNumber: string
  addressBetweenStreet1: string
  addressBetweenStreet2: string
  addressTypeId: number | null
  addressCreatedAt: string | null
  addressUpdatedAt: string | null
  deletedAt: string | null
}

export type { AddressInterface }
