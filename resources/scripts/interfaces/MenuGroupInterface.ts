

export interface MenuGroupInterface {
  key: string
  label: string
  name: string
  path: string
  icon:  string
  items: Array<MenuGroupInterface>
}
