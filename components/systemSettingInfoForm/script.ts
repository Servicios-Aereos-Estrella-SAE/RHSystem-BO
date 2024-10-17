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
    toleranceDelay: 0,
    toleranceFault: 0,
    toleranceDelayId: null,
    toleranceFaultId: null,
    systemModuleList: [] as SystemModuleInterface[],
    systemModules: []  as number[][],
    canUpdate: false,
  }),
  computed: {
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
    this.systemSetting.systemSettingSidebarColor =
      "#" + this.systemSetting.systemSettingSidebarColor;
    this.activeSwicht = isActive === 1 ? true : false;
    await this.getSystemModules()
    this.isReady = true;
    this.fetchTolerances();
  },
  methods: {
    async getSystemModules() {
      const response = await new SystemModuleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.systemModules.data : []
      this.systemModuleList = list
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
      const systemSettingService = new SystemSettingService();
      const response = await systemSettingService.getTolerances();
      if (response) {
        const tolerances = response.data;
        const delayTolerance = tolerances.find(
          (t: { toleranceName: string }) => t.toleranceName === "Delay"
        );
        const faultTolerance = tolerances.find(
          (t: { toleranceName: string }) => t.toleranceName === "Fault"
        );

        if (delayTolerance) {
          this.toleranceDelay = delayTolerance.toleranceMinutes;
          this.toleranceDelayId = delayTolerance.toleranceId;
        }
        if (faultTolerance) {
          this.toleranceFault = faultTolerance.toleranceMinutes;
          this.toleranceFaultId = faultTolerance.toleranceId;
        }
      }
    },
    async saveDelay() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      if (this.toleranceDelayId !== null) {
        const systemSettingService = new SystemSettingService();
        const response = await systemSettingService.updateTolerance(
          this.toleranceDelayId,
          this.toleranceDelay
        );
        myGeneralStore.setFullLoader(false);

        if (response) {
          this.$toast.add({
            severity: "success",
            summary: `System setting ${
              this.systemSetting.systemSettingId ? "updated" : "created"
            }`,
            detail: "save sucess",
            life: 5000,
          });
        } else {
          console.error("Error updating Tolerance Delay");
        }
      } else {
        console.error("Delay tolerance ID is missing");
      }
    },
    async saveFault() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      if (this.toleranceFaultId !== null) {
        const systemSettingService = new SystemSettingService();
        const response = await systemSettingService.updateTolerance(
          this.toleranceFaultId,
          this.toleranceFault
        );
        myGeneralStore.setFullLoader(false);
        if (response) {
          this.$toast.add({
            severity: "success",
            summary: `System setting ${
              this.systemSetting.systemSettingId ? "updated" : "created"
            }`,
            detail: "save sucess",
            life: 5000,
          });
        } else {
          console.error("Error updating Tolerance Fault");
        }
      } else {
        console.error("Fault tolerance ID is missing");
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
      } else {
        console.error('Delay tolerance ID is missing')
      }
    },
    deleteFault() {
      if (this.toleranceFaultId !== null) {
        this.deleteTolerance(this.toleranceFaultId)
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
          detail: "Only one image is allowed",
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
              detail: "Only .png, .webp, and .svg images are allowed.",
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
        let systemSettingResponse = null;
        const image = this.files.length > 0 ? this.files[0] : null;
        if (!this.systemSetting.systemSettingId) {
          systemSettingResponse = await systemSettingService.store(
            this.systemSetting,
            image
          );
        } else {
          systemSettingResponse = await systemSettingService.update(
            this.systemSetting,
            image
          );
        }
        if (
          systemSettingResponse.status === 201 ||
          systemSettingResponse.status === 200
        ) {
          this.$toast.add({
            severity: "success",
            summary: `System setting ${
              this.systemSetting.systemSettingId ? "updated" : "created"
            }`,
            detail: systemSettingResponse._data.message,
            life: 5000,
          });
          systemSettingResponse = await systemSettingService.show(
            systemSettingResponse._data.data.systemSetting.systemSettingId
          );
          if (systemSettingResponse?.status === 200) {
            const systemSetting =
              systemSettingResponse._data.data.systemSetting;
            this.$emit("save", systemSetting as SystemSettingInterface);
          }
        } else {
          const msgError = systemSettingResponse._data.error
            ? systemSettingResponse._data.error
            : systemSettingResponse._data.message;
          this.$toast.add({
            severity: "warn",
            summary: `System setting ${
              this.systemSetting.systemSettingId ? "updated" : "created"
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
