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

export default defineComponent({
  components: {
    Toast,
    ToastService,
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
          summary: `Delay tolerance ${this.tardinessToleranceId ? "updated" : "created"
            }`,
          detail: "Delay tolerance saved successfully",
          life: 5000,
        });
        this.toleranceDelayId = toleranceResponse._data.data.toleranceId
      } else {
        let msgError = toleranceResponse._data.message
        const severityType = toleranceResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Delay ${this.tardinessToleranceId ? 'updated' : 'created'}`,
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
          summary: `Fault tolerance ${this.tardinessToleranceId ? "updated" : "created"
            }`,
          detail: "Fault tolerance saved successfully",
          life: 5000,
        });
        this.toleranceFaultId = toleranceResponse._data.data.toleranceId
      } else {
        let msgError = toleranceResponse._data.message
        const severityType = toleranceResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Fault ${this.tardinessToleranceId ? 'updated' : 'created'}`,
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
          summary: `Tardiness tolerance ${this.tardinessToleranceId ? "updated" : "created"
            }`,
          detail: "Tardiness tolerance saved successfully",
          life: 5000,
        });
      } else {
        let msgError = toleranceResponse._data.message
        const severityType = toleranceResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Tardiness ${this.tardinessToleranceId ? 'updated' : 'created'}`,
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
          summary: `System setting Delete`,
          detail: "Delete sucess",
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
          summary: "Validation data",
          detail: "Missing data",
          life: 5000,
        });
        return;
      }
      if (this.files.length > 1) {
        this.$toast.add({
          severity: "warn",
          summary: "Image invalid",
          detail: "Only one image is allowed to logo",
          life: 5000,
        });
        return;
      }
      if (this.bannerFiles.length > 1) {
        this.$toast.add({
          severity: "warn",
          summary: "Image invalid",
          detail: "Only one image is allowed to banner",
          life: 5000,
        });
        return;
      }
      if (this.faviconFiles.length > 1) {
        this.$toast.add({
          severity: "warn",
          summary: "Image invalid",
          detail: "Only one image is allowed to favicon",
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
              summary: "Invalid Image",
              detail: "Only .png, .webp, and .svg images are allowed to logo.",
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
              summary: "Invalid Image",
              detail: "Only .png, .webp, and .svg images are allowed to banner.",
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
              summary: "Invalid Image",
              detail: "Only .png, .webp, and .svg images are allowed to favicon.",
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
            summary: `System setting ${this.systemSetting.systemSettingId ? "updated" : "created"
              }`,
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
                  summary: 'System modules assigned',
                  detail: 'All system modules were assigned successfully.',
                  life: 5000,
                });
              } else {
                const msgError = response._data.error
                  ? response._data.error
                  : response._data.message;
                this.$toast.add({
                  severity: "warn",
                  summary: `System modules assign ${this.systemSetting.systemSettingId ? "updated" : "created"
                    }`,
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
            summary: `System setting ${this.systemSetting.systemSettingId ? "updated" : "created"
              }`,
            detail: msgError,
            life: 5000,
          });
        }
      } else {
        this.$toast.add({
          severity: "error",
          summary: `System setting`,
          detail: "System setting not found",
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
  },
});
