import { DateTime } from 'luxon'
import Menu from 'primevue/menu'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftProceedingFileInterface } from '~/resources/scripts/interfaces/AircraftProceedingFileInterface'
import type { ItemMenuInterface } from '~/resources/scripts/interfaces/ItemMenuInterface'

export default defineComponent({
  components: {
    Menu,
  },
  name: 'aircraftProceedingFileInfoCard',
  props: {
    aircraftProceedingFile: { type: Object as PropType<AircraftProceedingFileInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
    menuRef: null as any, // Ref para el componente Menu
    items: [] as Array<ItemMenuInterface>
  }),
  computed: {
    dateYear() {
      if (!this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const year = parseInt(`${this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const month = parseInt(`${this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const day = parseInt(`${this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[2]}`)
      return day
    },
    calendarDay() {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('DD')
      return day
    },
  },
  mounted() {
    this.menuRef = this.$refs.menu
    this.items.push(
      {
        label: 'Open',
        icon: 'pi pi-external-link',
        command: () => {
          if (this.aircraftProceedingFile.proceedingFile?.proceedingFilePath) {
            window.open(this.aircraftProceedingFile.proceedingFile?.proceedingFilePath)
          }
        }
      },
      {
        label: 'Edit',
        icon: 'pi pi-refresh',
        command: () => {
          if (this.clickOnEdit) {
            this.clickOnEdit()
          }
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.clickOnDelete) {
            this.clickOnDelete()
          }
        }
      })
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
