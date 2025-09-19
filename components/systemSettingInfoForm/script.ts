import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SystemSettingInterface } from "~/resources/scripts/interfaces/SystemSettingInterface";
import SystemSettingService from "~/resources/scripts/services/SystemSettingService";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import { useMyGeneralStore } from "~/store/general";
import axios from "axios";
import SystemModuleService from "~/resources/scripts/services/SystemModuleService";
import type { SystemModuleInterface } from "~/resources/scripts/interfaces/SystemModuleInterface";
import ToleranceService from "~/resources/scripts/services/ToleranceService";
import type { ToleranceInterface } from "~/resources/scripts/interfaces/ToleranceInterface";
import SystemSettingsEmployeeService from "~/resources/scripts/services/SystemSettingsEmployeeService";
import type { SystemSettingsEmployeeInterface } from "~/resources/scripts/interfaces/SystemSettingsEmployeeInterface";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  name: "systemSettingInfoForm",
  props: {
    systemSetting: {
      type: Object as PropType<SystemSettingInterface>,
      required: true,
    },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    currenSystemSetting: null as SystemSettingInterface | null,
    isNewSystemSetting: false,
    isReady: false,
    files: [] as Array<any>,
    bannerFiles: [] as Array<any>,
    faviconFiles: [] as Array<any>,
    toleranceDelay: 0,
    toleranceFault: 0,
    tardinessTolerance: 0,
    toleranceDelayId: null,
    toleranceFaultId: null,
    systemModuleList: [] as SystemModuleInterface[],
    systemModules: [] as number[][],
    canUpdate: true,
    tardinessToleranceId: null,
    restrictFutureVacationSwicht: false,
    employeeLimit: null as number | null,
    employeeLimitId: null as number | null,
    employeeLimitHistory: [] as SystemSettingsEmployeeInterface[],
    showHistoryDropdown: false,
  }),
  computed: {
    isRoot() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
    groupedSystemModules() {
      const columns = 3
      const groups = []
      for (let i = 0; i < this.systemModuleList.length; i += columns) {
        groups.push(this.systemModuleList.slice(i, i + columns))
      }
      return groups
    }
  },
  async mounted() {
    this.isReady = false;
    this.isNewSystemSetting = !this.systemSetting.systemSettingId
      ? true
      : false;
    let isActive: number = 1;
    isActive = this.systemSetting.systemSettingActive
      ? this.systemSetting.systemSettingActive
      : 0;
    let isRestrictFutureVacationActive: number = 0;
    isRestrictFutureVacationActive = this.systemSetting.systemSettingRestrictFutureVacation
      ? this.systemSetting.systemSettingRestrictFutureVacation
      : 0;
    this.systemSetting.systemSettingSidebarColor =
      "#" + this.systemSetting.systemSettingSidebarColor;
    this.activeSwicht = isActive === 1 ? true : false;
    this.restrictFutureVacationSwicht = isRestrictFutureVacationActive === 1 ? true : false;
    await this.getSystemModules()
    this.isReady = true;
    this.fetchTolerances();
    this.fetchEmployeeLimit();
  },
  methods: {
    async getSystemModules() {
      const response = await new SystemModuleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.systemModules.data : []
      for await (const systemModule of list) {
        if (systemModule.systemModuleSlug !== 'users' && systemModule.systemModuleSlug !== 'system-settings' && systemModule.systemModuleSlug !== 'roles-and-permissions') {
          this.systemModuleList.push(systemModule)
        }
      }

      const systemSettingModules = [] as number[][]
      if (this.systemSetting.systemSettingId) {
        const systemModules = [] as Array<number>
        const systemSettingService = new SystemSettingService()
        const systemSettingResponse = await systemSettingService.show(this.systemSetting.systemSettingId)
        if (systemSettingResponse?.status === 200) {
          for await (const systemSettingSystemModule of systemSettingResponse._data.data.systemSetting.systemSettingSystemModules) {
            systemModules.push(systemSettingSystemModule.systemModuleId)
          }
        }
        systemSettingModules[0] = systemModules
      }
      this.systemModules = systemSettingModules
    },
    async fetchTolerances() {
      if (this.systemSetting.systemSettingId) {
        const systemSettingService = new SystemSettingService();
        const response = await systemSettingService.getTolerances(this.systemSetting.systemSettingId);
        if (response) {
          const tolerances = response.data;
          const delayTolerance = tolerances.find(
            (t: { toleranceName: string }) => t.toleranceName === "Delay"
          );
          const faultTolerance = tolerances.find(
            (t: { toleranceName: string }) => t.toleranceName === "Fault"
          );
          const tardinessTolerance = tolerances.find(
            (t: { toleranceName: string }) => t.toleranceName === "TardinessTolerance"
          );
          if (delayTolerance) {
            this.toleranceDelay = delayTolerance.toleranceMinutes;
            this.toleranceDelayId = delayTolerance.toleranceId;
          }
          if (faultTolerance) {
            this.toleranceFault = faultTolerance.toleranceMinutes;
            this.toleranceFaultId = faultTolerance.toleranceId;
          }
          if (tardinessTolerance) {
            this.tardinessTolerance = tardinessTolerance.toleranceMinutes;
            this.tardinessToleranceId = tardinessTolerance.toleranceId;
          }
        }
      }
    },
    async saveDelay() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      const toleranceService = new ToleranceService()
      const tolerance = {
        toleranceId: this.toleranceDelayId,
        toleranceName: 'Delay',
        toleranceMinutes: this.toleranceDelay,
        systemSettingId: this.systemSetting.systemSettingId
      } as ToleranceInterface

      const toleranceResponse = tolerance.toleranceId ? await toleranceService.update(tolerance) : await toleranceService.create(tolerance)

      myGeneralStore.setFullLoader(false);

      if (toleranceResponse) {
        this.$toast.add({
          severity: "success",
          summary: this.tardinessToleranceId ? this.t('delay_tolerance_updated') : this.t('delay_tolerance_created'),
          detail: this.t('delay_tolerance_saved_successfully'),
          life: 5000,
        });
        this.toleranceDelayId = toleranceResponse._data.data.toleranceId
      } else {
        let msgError = toleranceResponse._data.message
        const severityType = toleranceResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: this.tardinessToleranceId ? this.t('delay_tolerance_updated') : this.t('delay_tolerance_created'),
          detail: msgError,
          life: 5000,
        })
      }
    },
    async saveFault() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      const toleranceService = new ToleranceService()
      const tolerance = {
        toleranceId: this.toleranceFaultId,
        toleranceName: 'Fault',
        toleranceMinutes: this.toleranceFault,
        systemSettingId: this.systemSetting.systemSettingId
      } as ToleranceInterface

      const toleranceResponse = tolerance.toleranceId ? await toleranceService.update(tolerance) : await toleranceService.create(tolerance)

      myGeneralStore.setFullLoader(false);

      if (toleranceResponse) {
        this.$toast.add({
          severity: "success",
          summary: this.tardinessToleranceId ? this.t('fault_tolerance_updated') : this.t('fault_tolerance_created'),
          detail: this.t('fault_tolerance_saved_successfully'),
          life: 5000,
        });
        this.toleranceFaultId = toleranceResponse._data.data.toleranceId
      } else {
        let msgError = toleranceResponse._data.message
        const severityType = toleranceResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: this.tardinessToleranceId ? this.t('fault_tolerance_updated') : this.t('fault_tolerance_created'),
          detail: msgError,
          life: 5000,
        })
      }
    },
    async saveTardiness() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      const toleranceService = new ToleranceService()

      const tolerance = {
        toleranceId: this.tardinessToleranceId,
        toleranceName: 'TardinessTolerance',
        toleranceMinutes: this.tardinessTolerance,
        systemSettingId: this.systemSetting.systemSettingId
      } as ToleranceInterface

      const toleranceResponse = tolerance.toleranceId ? await toleranceService.update(tolerance) : await toleranceService.create(tolerance)
      this.tardinessToleranceId = toleranceResponse._data.data.toleranceId

      myGeneralStore.setFullLoader(false);
      if (toleranceResponse) {
        this.$toast.add({
          severity: "success",
          summary: this.tardinessToleranceId ? this.t('tardiness_tolerance_updated') : this.t('tardiness_tolerance_created'),
          detail: this.t('tardiness_tolerance_saved_successfully'),
          life: 5000,
        });
      } else {
        let msgError = toleranceResponse._data.message
        const severityType = toleranceResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: this.tardinessToleranceId ? this.t('tardiness_tolerance_updated') : this.t('tardiness_tolerance_created'),
          detail: msgError,
          life: 5000,
        })
      }
    },

    onUpload(event: any) {
      this.systemSetting.systemSettingPhoto = event.files[0];
    },
    onSelect(event: any) {
      this.systemSetting.systemSettingPhoto = event.files[0];
    },
    async deleteTolerance(id: null) {
      const systemSettingService = new SystemSettingService();
      const response = await systemSettingService.deleteTolerance(id)
      if (response) {
        this.$toast.add({
          severity: "success",
          summary: this.t('system_setting_delete'),
          detail: this.t('delete_success'),
          life: 5000,
        });
        if (id === this.toleranceDelayId) {
          this.toleranceDelay = 0
        } else if (id === this.toleranceFaultId) {
          this.toleranceFault = 0
        }

      } else {
        console.error(`Error deleting tolerance with ID ${id}`)
      }
    },
    deleteDelay() {
      if (this.toleranceDelayId !== null) {
        this.deleteTolerance(this.toleranceDelayId)
        this.toleranceDelay = 0
      } else {
        console.error('Delay tolerance ID is missing')
      }
    },
    deleteFault() {
      if (this.toleranceFaultId !== null) {
        this.deleteTolerance(this.toleranceFaultId)
        this.toleranceFault = 0
      } else {
        console.error('Fault tolerance ID is missing')
      }
    },
    deleteTardiness() {
      if (this.tardinessToleranceId !== null) {
        this.deleteTolerance(this.tardinessToleranceId)
        this.tardinessTolerance = 0
      } else {
        console.error('Fault tolerance ID is missing')
      }
    },
    async onSave() {
      this.submitted = true;
      const systemSettingService = new SystemSettingService();
      if (!systemSettingService.validateSystemSettingInfo(this.systemSetting)) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        });
        return;
      }
      if (this.files.length > 1) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('image_invalid'),
          detail: this.t('only_one_image_logo'),
          life: 5000,
        });
        return;
      }
      if (this.bannerFiles.length > 1) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('image_invalid'),
          detail: this.t('only_one_image_banner'),
          life: 5000,
        });
        return;
      }
      if (this.faviconFiles.length > 1) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('image_invalid'),
          detail: this.t('only_one_image_favicon'),
          life: 5000,
        });
        return;
      }
      for await (const file of this.files) {
        if (file) {
          const mimeType = file.type;
          const isImage = mimeType.startsWith("image/");
          const allowedFormats = ["image/png", "image/webp", "image/svg+xml"];

          if (!isImage || !allowedFormats.includes(mimeType)) {
            this.$toast.add({
              severity: "warn",
              summary: this.t('invalid_image'),
              detail: this.t('only_png_webp_svg_logo'),
              life: 5000,
            });
            return;
          }
        }
      }
      for await (const file of this.bannerFiles) {
        if (file) {
          const mimeType = file.type;
          const isImage = mimeType.startsWith("image/");
          const allowedFormats = ["image/png", "image/webp", "image/svg+xml"];

          if (!isImage || !allowedFormats.includes(mimeType)) {
            this.$toast.add({
              severity: "warn",
              summary: this.t('invalid_image'),
              detail: this.t('only_png_webp_svg_banner'),
              life: 5000,
            });
            return;
          }
        }
      }
      for await (const file of this.faviconFiles) {
        if (file) {
          const mimeType = file.type;
          const isImage = mimeType.startsWith("image/");
          const allowedFormats = ["image/png", "image/webp", "image/svg+xml"];

          if (!isImage || !allowedFormats.includes(mimeType)) {
            this.$toast.add({
              severity: "warn",
              summary: this.t('invalid_image'),
              detail: this.t('only_png_webp_svg_favicon'),
              life: 5000,
            });
            return;
          }
        }
      }
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      if (this.systemSetting.systemSettingSidebarColor) {
        this.systemSetting.systemSettingSidebarColor =
          this.systemSetting.systemSettingSidebarColor
            ?.toString()
            .replaceAll("#", "");
      }
      if (this.systemSetting) {
        this.systemSetting.systemSettingActive = this.activeSwicht ? 1 : 0;
        this.systemSetting.systemSettingRestrictFutureVacation = this.restrictFutureVacationSwicht ? 1 : 0;
        let systemSettingResponse = null;
        const systemSettingLogo = this.files.length > 0 ? this.files[0] : null;
        const systemSettingBanner = this.bannerFiles.length > 0 ? this.bannerFiles[0] : null;
        const systemSettingFavicon = this.faviconFiles.length > 0 ? this.faviconFiles[0] : null;
        if (!this.systemSetting.systemSettingId) {
          systemSettingResponse = await systemSettingService.store(
            this.systemSetting,
            systemSettingLogo,
            systemSettingBanner,
            systemSettingFavicon
          );
        } else {
          systemSettingResponse = await systemSettingService.update(
            this.systemSetting,
            systemSettingLogo,
            systemSettingBanner,
            systemSettingFavicon
          );
        }
        if (
          systemSettingResponse.status === 201 ||
          systemSettingResponse.status === 200
        ) {
          this.$toast.add({
            severity: "success",
            summary: this.systemSetting.systemSettingId ? this.t('system_setting_updated') : this.t('system_setting_created'),
            detail: systemSettingResponse._data.message,
            life: 5000,
          });
          systemSettingResponse = await systemSettingService.show(
            systemSettingResponse._data.data.systemSetting.systemSettingId
          );
          if (systemSettingResponse?.status === 200) {
            const systemSetting =
              systemSettingResponse._data.data.systemSetting
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            if (myGeneralStore.isRoot) {
              const systemModules = []
              for (const systemModuleId of this.systemModules[0]) {
                systemModules.push(systemModuleId)
              }
              const response = await new SystemSettingService().assignSystemModules(systemSetting.systemSettingId, systemModules)
              if (response.status === 201) {
                this.$toast.add({
                  severity: 'success',
                  summary: this.t('system_modules_assigned'),
                  detail: this.t('all_system_modules_assigned_successfully'),
                  life: 5000,
                });
              } else {
                const msgError = response._data.error
                  ? response._data.error
                  : response._data.message;
                this.$toast.add({
                  severity: "warn",
                  summary: this.systemSetting.systemSettingId ? this.t('system_modules_assign_updated') : this.t('system_modules_assign_created'),
                  detail: msgError,
                  life: 5000,
                });
              }
            }
            myGeneralStore.setFullLoader(false)
            this.$emit("save", systemSetting as SystemSettingInterface);
          }
        } else {
          const msgError = systemSettingResponse._data.error
            ? systemSettingResponse._data.error
            : systemSettingResponse._data.message;
          this.$toast.add({
            severity: "warn",
            summary: this.systemSetting.systemSettingId ? this.t('system_setting_updated') : this.t('system_setting_created'),
            detail: msgError,
            life: 5000,
          });
        }
      } else {
        this.$toast.add({
          severity: "error",
          summary: this.t('system_setting_created'),
          detail: this.t('system_setting_not_found'),
          life: 5000,
        });
      }
      myGeneralStore.setFullLoader(false);
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate();
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    validateBannerFiles(event: any) {
      let validFiles = event.files;
      this.bannerFiles = validFiles;
      this.$forceUpdate();
    },
    getBannerObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    validateFaviconFiles(event: any) {
      let validFiles = event.files;
      this.faviconFiles = validFiles;
      this.$forceUpdate();
    },
    getFaviconObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    addHash() {
      if (
        !this.systemSetting.systemSettingSidebarColor
          ?.toString()
          .startsWith("#")
      ) {
        this.systemSetting.systemSettingSidebarColor =
          "#" + this.systemSetting.systemSettingSidebarColor;
      }
    },
    updateColor(event: any) {
      this.systemSetting.systemSettingSidebarColor = "#" + event.value;
    },
    async fetchEmployeeLimit() {
      if (this.systemSetting.systemSettingId) {
        const systemSettingsEmployeeService = new SystemSettingsEmployeeService();
        const response = await systemSettingsEmployeeService.getBySystemSettingId(this.systemSetting.systemSettingId);
        if (response && response.status === 200) {
          const employees = response._data.data.systemSettingsEmployees;
          this.employeeLimitHistory = employees.sort((a: SystemSettingsEmployeeInterface, b: SystemSettingsEmployeeInterface) =>
            new Date(b.systemSettingEmployeeUpdatedAt || '').getTime() - new Date(a.systemSettingEmployeeUpdatedAt || '').getTime()
          );

          // Find the active employee limit
          const activeEmployee = employees.find((emp: SystemSettingsEmployeeInterface) => emp.isActive === 1);
          if (activeEmployee) {
            this.employeeLimit = activeEmployee.employeeLimit;
            this.employeeLimitId = activeEmployee.systemSettingEmployeeId;
          }
        }
      }
    },
    async saveEmployeeLimit() {
      // Validate input
      if (this.employeeLimit !== null && (this.employeeLimit < 0 || this.employeeLimit > 999999)) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('invalid_input'),
          detail: this.t('employee_limit_validation'),
          life: 5000,
        });
        return;
      }

      // Check if the value has changed
      const currentActiveEmployee = this.employeeLimitHistory.find(emp => emp.isActive === 1);
      if (currentActiveEmployee && currentActiveEmployee.employeeLimit === this.employeeLimit) {
        // Simulate success without API call
        this.$toast.add({
          severity: "success",
          summary: this.t('employee_limit_already_set'),
          detail: this.t('employee_limit_already_set_to_this_value'),
          life: 3000,
        });
        return;
      }

      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);

      const systemSettingsEmployeeService = new SystemSettingsEmployeeService();
      const response = await systemSettingsEmployeeService.create(this.systemSetting.systemSettingId!, this.employeeLimit);

      myGeneralStore.setFullLoader(false);

      if (response) {
        let severity = "success";
        let summary = "Employee limit created";
        let detail = "Employee limit was created successfully";

        switch (response.status) {
          case 200:
          case 201:
            severity = "success";
            summary = this.t('employee_limit_created');
            detail = response._data?.message || this.t('employee_limit_created_successfully');
            this.employeeLimitId = response._data?.data?.systemSettingsEmployee?.systemSettingEmployeeId;
            await this.fetchEmployeeLimit(); // Refresh the data
            break;
          case 400:
            severity = "warn";
            summary = this.t('failed_to_set_employee_limit');
            detail = this.t('failed_to_establish_employee_limit');
            break;
          case 404:
            severity = "warn";
            summary = this.t('error_unknown_element');
            detail = this.t('error_unknown_element');
            break;
          case 422:
            severity = "info";
            summary = this.t('invalid_format');
            detail = this.t('invalid_format');
            break;
          case 500:
            severity = "error";
            summary = this.t('server_error');
            detail = this.t('server_error');
            break;
          default:
            severity = "warn";
            summary = this.t('unexpected_error');
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
    async deleteEmployeeLimit() {
      if (!this.employeeLimitId || this.employeeLimit === null || this.employeeLimit === 0) {
        this.$toast.add({
          severity: "warn",
          summary: this.t('no_employee_limit_to_delete'),
          detail: this.t('no_employee_limit_to_delete_message'),
          life: 5000,
        });
        return;
      }

      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);

      const systemSettingsEmployeeService = new SystemSettingsEmployeeService();
      const response = await systemSettingsEmployeeService.delete(this.systemSetting.systemSettingId!);

      myGeneralStore.setFullLoader(false);

      if (response) {
        let severity = "success";
        let summary = "Employee limit deleted";
        let detail = "Employee limit was deleted successfully";

        switch (response.status) {
          case 200:
          case 201:
            severity = "success";
            summary = this.t('employee_limit_deleted');
            detail = response._data?.message || this.t('employee_limit_deleted_successfully');
            this.employeeLimit = null;
            this.employeeLimitId = null;
            await this.fetchEmployeeLimit(); // Refresh the data
            break;
          case 400:
            severity = "warn";
            summary = this.t('failed_to_set_employee_limit');
            detail = this.t('failed_to_establish_employee_limit');
            break;
          case 404:
            severity = "warn";
            summary = this.t('error_unknown_element');
            detail = this.t('error_unknown_element');
            break;
          case 422:
            severity = "info";
            summary = this.t('invalid_format');
            detail = this.t('invalid_format');
            break;
          case 500:
            severity = "error";
            summary = this.t('server_error');
            detail = this.t('server_error');
            break;
          default:
            severity = "warn";
            summary = this.t('unexpected_error');
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
    toggleHistoryDropdown() {
      this.showHistoryDropdown = !this.showHistoryDropdown;
    },
  },
});
