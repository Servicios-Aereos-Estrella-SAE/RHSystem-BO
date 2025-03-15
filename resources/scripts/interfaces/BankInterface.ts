interface BankInterface {
  bankId: number,
  bankName: string,
  bankActive: number,
  bankCreatedAt: string,
  bankUpdatedAt: string,
  bankDeletedAt: string | null
}

export type { BankInterface }
