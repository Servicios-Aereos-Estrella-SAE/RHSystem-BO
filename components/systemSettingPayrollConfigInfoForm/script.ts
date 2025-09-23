import { defineComponent } from "vue";
import type { PropType } from "vue";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import { useMyGeneralStore } from "~/store/general";
import type { SystemSettingPayrollConfigInterface } from "~/resources/scripts/interfaces/SystemSettingPayrollConfigInterface";
import SystemSettingPayrollConfigService from "~/resources/scripts/services/SystemSettingPayrollConfigService";
import { DateTime } from "luxon";

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: "systemSettingPayrollConfigInfoForm",
  props: {
    systemSettingPayrollConfig: {
      type: Object as PropType<SystemSettingPayrollConfigInterface>,
      required: true,
    },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    currenSystemSettingPayrollConfig: null as SystemSettingPayrollConfigInterface | null,
    isNewSystemSettingPayrollConfig: false,
    isReady: false,
    canUpdate: true,
    paymentTypeOptions: [
      { label: 'Biweekly', value: 'biweekly' },
      { label: 'Specific day of month', value: 'specific_day_of_month' },
      { label: 'Fixed day every N weeks', value: 'fixed_day_every_n_weeks' }
    ],
    systemSettingPayrollConfigApplySince: ''
  }),
  watch: {
    'systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType'(newVal) {
      this.handlePaymentTypeChange(newVal)
    }
  },
  computed: {
  },
  async mounted() {
    this.isReady = false;
    this.isNewSystemSettingPayrollConfig = !this.systemSettingPayrollConfig.systemSettingPayrollConfigId
      ? true
      : false;
    if (this.systemSettingPayrollConfig?.systemSettingPayrollConfigApplySince) {
      this.systemSettingPayrollConfig.systemSettingPayrollConfigApplySince = new Date(this.systemSettingPayrollConfig?.systemSettingPayrollConfigApplySince).toISOString().slice(0, 10)
      this.systemSettingPayrollConfigApplySince = this.getFormattedDate(this.systemSettingPayrollConfig?.systemSettingPayrollConfigApplySince)
    }

    this.isReady = true;
  },
  methods: {
    handlePaymentTypeChange(type: string) {
      if (type === 'biweekly') {
        this.systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid = 15
      } else {
        this.systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid = 0
      }
    },
    async onSave() {
      this.submitted = true;
      const systemSettingPayrollConfigService = new SystemSettingPayrollConfigService();
      if (!systemSettingPayrollConfigService.validateInfo(this.systemSettingPayrollConfig)) {
        this.$toast.add({
          severity: "warn",
          summary: "Validation data",
          detail: "Missing data",
          life: 5000,
        });
        return;
      }


      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);

      if (this.systemSettingPayrollConfig) {
        let systemSettingPayrollConfigResponse = null;
        if (!this.systemSettingPayrollConfig.systemSettingPayrollConfigId) {
          systemSettingPayrollConfigResponse = await systemSettingPayrollConfigService.store(
            this.systemSettingPayrollConfig
          );
        } else {
          systemSettingPayrollConfigResponse = await systemSettingPayrollConfigService.update(
            this.systemSettingPayrollConfig
          );
        }
        if (
          systemSettingPayrollConfigResponse.status === 201 ||
          systemSettingPayrollConfigResponse.status === 200
        ) {
          this.$toast.add({
            severity: "success",
            summary: `System setting payroll config ${this.systemSettingPayrollConfig.systemSettingPayrollConfigId ? "updated" : "created"
              }`,
            detail: systemSettingPayrollConfigResponse._data.message,
            life: 5000,
          });
          systemSettingPayrollConfigResponse = await systemSettingPayrollConfigService.show(
            systemSettingPayrollConfigResponse._data.data.systemSettingPayrollConfig.systemSettingPayrollConfigId
          );
          if (systemSettingPayrollConfigResponse?.status === 200) {
            const systemSettingPayrollConfig =
              systemSettingPayrollConfigResponse._data.data.systemSettingPayrollConfig

            this.$emit("onPayrollConfigSave", systemSettingPayrollConfig as SystemSettingPayrollConfigInterface);
          }
        } else {
          const msgError = systemSettingPayrollConfigResponse._data.error
            ? systemSettingPayrollConfigResponse._data.error
            : systemSettingPayrollConfigResponse._data.message;
          this.$toast.add({
            severity: "warn",
            summary: `System setting payroll config ${this.systemSettingPayrollConfig.systemSettingPayrollConfigId ? "updated" : "created"
              }`,
            detail: msgError,
            life: 5000,
          });
        }
      } else {
        this.$toast.add({
          severity: "error",
          summary: `System setting payroll config`,
          detail: "System setting payroll config not found",
          life: 5000,
        });
      }
      myGeneralStore.setFullLoader(false);
    },
    getFormattedDate(date: string) {
      const dateNew = DateTime.fromISO(date, { setZone: true })
      return dateNew.setLocale('en').toFormat('DDDD')
    }
  },
});
