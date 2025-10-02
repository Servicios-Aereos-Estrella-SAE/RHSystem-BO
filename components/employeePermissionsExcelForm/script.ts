import { defineComponent } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import AssistService from '~/resources/scripts/services/AssistService';
import { DateTime } from 'luxon';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeePermissionsExcelForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  data: () => ({
    isReady: false,
    isDownloading: false,
    startDate: null as Date | null,
    endDate: null as Date | null,
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(),
    localeToUse: 'en',
  }),
  computed: {
  },
  watch: {
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    this.isReady = true
  },
  methods: {
    async downloadExcel() {
      if (!this.startDate || !this.endDate) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('please_select_start_and_end_dates'),
          life: 5000,
        })
        return
      }

      if (this.startDate > this.endDate) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('start_date_must_be_before_end_date'),
          life: 5000,
        })
        return
      }

      this.isDownloading = true
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      try {
        const assistService = new AssistService()
        const startDateFormatted = DateTime.fromJSDate(this.startDate).toFormat('yyyy-MM-dd')
        const endDateFormatted = DateTime.fromJSDate(this.endDate).toFormat('yyyy-MM-dd')

        const response = await assistService.getExcelPermissionsDates(startDateFormatted, endDateFormatted)

        if (response && response.status === 200) {
          // Crear blob del archivo Excel
          const blob = new Blob([response._data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })

          // Crear URL del blob y descargar
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `permisos_${startDateFormatted}_${endDateFormatted}.xlsx`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('excel_downloaded_successfully'),
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('error'),
            detail: this.t('error_downloading_excel'),
            life: 5000,
          })
        }
      } catch (error: any) {
        console.error('Error downloading Excel:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_downloading_excel'),
          life: 5000,
        })
      } finally {
        this.isDownloading = false
        myGeneralStore.setFullLoader(false)
      }
    }
  }
})
