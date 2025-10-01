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
      { label: 'Monthly', value: 'specific_day_of_month' },
      { label: 'Specific day', value: 'fixed_day_every_n_weeks' },
      { label: 'Fourteenth', value: 'fourteenth' }
    ],
    systemSettingPayrollConfigApplySince: '',
    daysOfWeeks: [
      { label: 'Monday', value: 'monday' },
      { label: 'Tuesday', value: 'tuesday' },
      { label: 'Wednesday', value: 'wednesday' },
      { label: 'Thursday', value: 'thursday' },
      { label: 'Friday', value: 'friday' },
      { label: 'Saturday', value: 'saturday' },
      { label: 'Sunday', value: 'sunday' },
    ],
    advanceDateInMonthsOf31Days: false,
    advanceDateOnHolidays: false,
    advanceDateOnWeekends: false
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
    this.advanceDateInMonthsOf31Days = this.systemSettingPayrollConfig.systemSettingPayrollConfigAdvanceDateInMonthsOf31Days === 1;
    this.advanceDateOnHolidays = this.systemSettingPayrollConfig.systemSettingPayrollConfigAdvanceDateOnHolidays === 1;
    this.advanceDateOnWeekends = this.systemSettingPayrollConfig.systemSettingPayrollConfigAdvanceDateOnWeekends === 1;
    if (this.systemSettingPayrollConfig?.systemSettingPayrollConfigApplySince) {
      this.systemSettingPayrollConfig.systemSettingPayrollConfigApplySince = new Date(this.systemSettingPayrollConfig?.systemSettingPayrollConfigApplySince).toISOString().slice(0, 10)
      this.systemSettingPayrollConfigApplySince = this.getFormattedDate(this.systemSettingPayrollConfig?.systemSettingPayrollConfigApplySince)
    } else {
      this.systemSettingPayrollConfig.systemSettingPayrollConfigApplySince = new Date().toISOString().slice(0, 10)
    }

    this.isReady = true;
  },
  methods: {
    handlePaymentTypeChange(type: string) {
      this.systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset = 0
      if (type === 'biweekly') {
        this.systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid = 15
      } else if (type === 'specific_day_of_month') {
        this.systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid = 1
      } else {
        this.systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid = null
      }
    },
    async onSave() {
      this.submitted = true;
      const systemSettingPayrollConfigService = new SystemSettingPayrollConfigService();
      this.systemSettingPayrollConfig.systemSettingPayrollConfigAdvanceDateInMonthsOf31Days = this.advanceDateInMonthsOf31Days ? 1 : 0;
      this.systemSettingPayrollConfig.systemSettingPayrollConfigAdvanceDateOnHolidays = this.advanceDateOnHolidays ? 1 : 0;
      this.systemSettingPayrollConfig.systemSettingPayrollConfigAdvanceDateOnWeekends = this.advanceDateOnWeekends ? 1 : 0;
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
