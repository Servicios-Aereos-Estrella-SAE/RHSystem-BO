interface ProceedingFileTypeInterface {
  proceedingFileTypeId: number | null,
  proceedingFileTypeName: string,
  proceedingFileTypeSlug: string,
  proceedingFileTypeAreaToUse: string,
  proceedingFileTypeActive: number,
  proceedingFileTypeCreatedAt?: string | null,
  proceedingFileTypeUpdatedAt?: string | null,
  proceedingFileTypeDeletedAt?: string | null
}

export type { ProceedingFileTypeInterface }
