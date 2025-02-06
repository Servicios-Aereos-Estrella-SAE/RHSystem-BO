import { DateTime } from 'luxon'
import Menu from 'primevue/menu'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeProceedingFileInterface } from '~/resources/scripts/interfaces/EmployeeProceedingFileInterface'
import type { ItemMenuInterface } from '~/resources/scripts/interfaces/ItemMenuInterface'

export default defineComponent({
  components: {
    Menu,
  },
  name: 'employeeProceedingFileInfoCard',
  props: {
    employeeProceedingFile: { type: Object as PropType<EmployeeProceedingFileInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canReadOnlyFiles: { type: Boolean, default: false, required: true },
    canManageFiles: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    menuRef: null as any, // Ref para el componente Menu
    items: [] as Array<ItemMenuInterface>,
    fileIcons: [
      { ext: 'webp', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icono-image.svg' },
      { ext: 'jpg', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icono-image.svg' },
      { ext: 'jpeg', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icono-image.svg' },
      { ext: 'png', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icono-image.svg' },
      { ext: 'xlsx', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-excel.svg' },
      { ext: 'xls', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-excel.svg' },
      { ext: 'pdf', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-pdf.svg' },
      { ext: 'doc', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-word.svg' },
      { ext: 'docs', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-word.svg' },
      { ext: 'ppt', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-presentation.svg' },
      { ext: 'pptx', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-presentation.svg' },
      { ext: 'zip', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-zip.svg' },
      { ext: 'rar', icon: 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-zip.svg' },
    ]
  }),
  computed: {
    dateYear() {
      if (!this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const year = parseInt(`${this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const month = parseInt(`${this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const day = parseInt(`${this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[2]}`)
      return day
    },
    calendarDay() {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('DD')
      return day
    },
    fileIcon() {
      let icon = 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/sae-bo-system/icons/icon-file.svg'

      if (this.employeeProceedingFile.proceedingFile?.proceedingFilePath) {
        const splitted = `${this.employeeProceedingFile.proceedingFile.proceedingFilePath}`.split('.')
        const extension = splitted[splitted.length - 1]
        const item = this.fileIcons.find(itemIcon => itemIcon.ext === extension)
        icon = item ? item.icon : icon
      }

      return icon
    }
  },
  mounted() {
    this.menuRef = this.$refs.menu
    if (this.canReadOnlyFiles || this.canManageFiles) {
      this.items.push(
        {
          label: 'Open',
          icon: 'pi pi-external-link',
          command: () => {
            if (this.employeeProceedingFile.proceedingFile?.proceedingFilePath) {
              window.open(this.employeeProceedingFile.proceedingFile?.proceedingFilePath)
            }
          }
        })
    }

    if (this.canReadOnlyFiles || this.canManageFiles) {
      this.items.push(
        {
          label: 'Edit',
          icon: 'pi pi-refresh',
          command: () => {
            if (this.clickOnEdit) {
              this.clickOnEdit()
            }
          }
        })
    }

    if (this.canManageFiles) {
      this.items.push(
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => {
            if (this.clickOnDelete) {
              this.clickOnDelete()
            }
          }
        })
    }
  },
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    toggle(event: any) {
      if (this.menuRef && typeof this.menuRef.toggle === 'function') {
        this.menuRef.toggle(event);
      }
    }
  }
})