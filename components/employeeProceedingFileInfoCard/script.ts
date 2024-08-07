import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeProceedingFileInterface } from '~/resources/scripts/interfaces/EmployeeProceedingFileInterface'
import type { ItemMenuInterface } from '~/resources/scripts/interfaces/ItemMenuInterface'

export default defineComponent({
  name: 'employeeProceedingFileInfoCard',
  props: {
    employeeProceedingFile: { type: Object as PropType<EmployeeProceedingFileInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
    items: [] as Array<ItemMenuInterface>
  }),
  computed: {
  },
  mounted() {
    this.items.push({
          label: 'Open',
          icon: 'pi pi-external-link',
          command: () => {
            if (this.employeeProceedingFile.proceedingFile?.proceedingFilePath) {
              window.open(this.employeeProceedingFile.proceedingFile?.proceedingFilePath)
            }
          }
    },
    {
      label: 'Update',
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
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    }
  }
})