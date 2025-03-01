interface IConInterface {
  iconId: number | null,
  iconName: string,
  iconSvg: string,
  holidayIcon: string,
  iconCreatedAt: Date | string,
  iconUpdatedAt: Date | string,
  deletedAt: Date | string | null,
}

export type { IConInterface }
