import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeExcelImporter',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    isReady: false,
    // Excel Import properties
    excelFiles: [] as Array<any>,
    submitted: false,
  }),
  computed: {
    canImportExcel() {
      return this.excelFiles.length > 0
    }
  },
  async mounted() {
    this.isReady = true
  },
  methods: {
    browseFiles() {
      const fileInput = this.$refs.fileUpload.$el.querySelector('input[type=file]')
      if (fileInput) {
        fileInput.click()
      }
    },
    validateExcelFiles(event: any) {
      const files = event.files
      if (files && files.length > 0) {
        const file = files[0]
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel' // .xls
        ]

        if (!allowedTypes.includes(file.type)) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('invalid_file_type'),
            detail: this.t('please_select_excel_file'),
            life: 5000,
          })
          this.excelFiles = []
          return
        }

        if (file.size > 10000000) { // 10MB
          this.$toast.add({
            severity: 'warn',
            summary: this.t('file_too_large'),
            detail: this.t('file_size_must_be_less_than_10mb'),
            life: 5000,
          })
          this.excelFiles = []
          return
        }

        this.excelFiles = files
      }
    },
    async importExcel() {
      // Validate input
      if (!this.canImportExcel) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('missing_required_fields'),
          detail: this.t('please_fill_all_required_fields'),
          life: 5000,
        });
        return;
      }

      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);

      const employeeService = new EmployeeService();
      const file = this.excelFiles[0];
      const response = await employeeService.importExcel(file);

      myGeneralStore.setFullLoader(false);

      if (response) {
        let severity = "success";
        let summary = "Excel import completed";
        let detail = "Excel import was completed successfully";

        switch (response.status) {
          case 200:
          case 201:
            if (response._data && response._data.type === 'success') {
              const data = response._data.data;
              severity = "success";
              summary = this.t('import_completed');
              detail = `${this.t('import_successful')}: ${data.created} ${this.t('employees_created')}, ${data.updated} ${this.t('employees_updated')}, ${data.skipped} ${this.t('employees_skipped')}`;

              // Reset form
              this.excelFiles = [];

              // Emit save event to refresh the employee list
              if (this.clickOnSave) {
                this.clickOnSave();
              }
            } else {
              severity = "warn";
              summary = this.t('import_failed');
              detail = response._data?.message || this.t('import_failed');
            }
            break;
          case 400:
            severity = "warn";
            summary = this.t('import_failed');
            detail = this.t('bad_request');
            break;
          case 404:
            severity = "warn";
            summary = this.t('import_failed');
            detail = this.t('not_found');
            break;
          case 422:
            severity = "info";
            summary = this.t('import_failed');
            detail = this.t('invalid_format');
            break;
          case 500:
            severity = "error";
            summary = this.t('import_failed');
            detail = this.t('server_error');
            break;
          default:
            severity = "warn";
            summary = this.t('import_failed');
            detail = response._data?.message || this.t('unexpected_error_occurred');
        }

        this.$toast.add({
          severity: severity as "success" | "info" | "warn" | "error",
          summary,
          detail,
          life: 5000,
        });
      }
    },
  }
})
