interface ProceedingFileTypeInterface {
  proceedingFileTypeId: number | null,
  proceedingFileTypeName: string,
  proceedingFileTypeSlug: string,
  proceedingFileTypeAreaToUse: string,
  proceedingFileTypeActive: number,
  proceedingFileTypeCreatedAt?: string | null,
  proceedingFileTypeUpdatedAt?: string | null,
  proceedingFileTypeDeletedAt?: string | null
  parentId: number | null
  children?: ProceedingFileTypeInterface[]
}

export type { ProceedingFileTypeInterface }
