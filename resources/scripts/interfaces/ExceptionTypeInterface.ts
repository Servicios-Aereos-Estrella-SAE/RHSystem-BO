interface ExceptionTypeInterface {
  exceptionTypeId: number,
  exceptionTypeTypeName: string,
  exceptionTypeIcon: string,
  exceptionTypeSlug: string,
  exceptionTypeCreatedAt: Date | string | null,
  exceptionTypeUpdatedAt: Date | string | null,
  exceptionTypeDeletedAt: Date | string | null
}

export type { ExceptionTypeInterface }
