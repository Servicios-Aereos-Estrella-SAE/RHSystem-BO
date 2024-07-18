import type { ShiftInterface } from "~/resources/scripts/interfaces/ShiftInterface";
import HolidayService from "~/resources/scripts/services/HolidayService"
import IConInterface from '~/resources/scripts/interfaces/IconInterface'
export default defineComponent({
  
  name: 'HolidayInfoForm',
  props: {
    holiday: { type: Object as PropType<HolidayInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    
  },
  data: () => ({
    submitted: false,
    selectedCities: '',
    isUpdate: false,
    icons: [] as IConInterface[],
    holidayService: new HolidayService()
  }),
  async mounted() {
    this.isUpdate = this.holiday.holidayId ? true : false
    await this.getListIcons()
  },
  methods: {
    async getListIcons() {
      const response = await this.holidayService.getIconList()
      this.icons = response._data
    },
    getHolidayIcon(iconId: number) {
      let icon = this.icons.find(icon => icon.iconId === iconId)
      return icon ? icon.iconSvg : ''
    },
    async onSave() {
      this.submitted = true;
      let holidayResponse = null
      if (this.validForm()) {
        const response = this.holiday.holidayId ? await this.holidayService.update(this.holiday) : await this.holidayService.store(this.holiday);
        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Holiday saved successfully',
            life: 5000
          });
          holidayResponse = await this.holidayService.show(response._data.data.holidayId)
          if (holidayResponse?.status === 200) {
            const holiday = holidayResponse._data.data.holiday
            this.$emit('save', holiday as HolidayInterface)
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the holiday',
            life: 5000
          });
          this.$emit('save');
        }
      }
    },
    validForm() {
      return this.holiday && this.holiday.holidayName && this.holiday.holidayDate && this.holiday.holidayIcon && (this.holiday.holidayFrequency > 0 && this.holiday.holidayFrequency <= 100)
    },
  },
  watch: {
    'holiday.holidayIconId': function (val: string) {
      this.holiday.holidayIcon = this.getHolidayIcon(Number(val))
    },
  }
});
