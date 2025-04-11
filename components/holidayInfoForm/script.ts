import HolidayService from "~/resources/scripts/services/HolidayService"
import type { IConInterface } from '~/resources/scripts/interfaces/IconInterface'

export default defineComponent({

  name: 'HolidayInfoForm',
  props: {
    holiday: { type: Object as PropType<HolidayInterface>, required: true },
    clickOnSave: { type: Function, default: null },

  },
  data: () => ({
    submitted: false,
    selectedCities: '',
    isVisibleIcons: true as boolean,
    iconSelected: null as IConInterface | null,
    isUpdate: false,
    icons: [] as IConInterface[],
    holidayService: new HolidayService(),
    alertConfirmDelete: false as boolean,
  }),
  async mounted() {
    this.isUpdate = this.holiday.holidayId ? true : false
    const _date = new Date(this.holiday.holidayDate)
    const dtDateOnly = new Date(_date.valueOf() + _date.getTimezoneOffset() * 60 * 1000);
    this.holiday.holidayDate = dtDateOnly//new Date(this.holiday.holidayDate).toLocaleString('en-US', { timeZone: 'UTC-6' })
    await this.getListIcons()
    this.iconSelected = (this.isUpdate ? this.icons.find((icon: IConInterface) => icon.iconId === this.holiday.holidayIconId) : null) as IConInterface | null
    this.isVisibleIcons = this.isUpdate ? false : true
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
    onSelectIcon() {
      this.submitted = true
      if (this.holiday.holidayIconId) {
        this.submitted = false
        this.isVisibleIcons = false
      }
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
    selectIcon(icon: IConInterface) {
      this.holiday.holidayIconId = icon.iconId;
      this.holiday.holidayIcon = icon.iconSvg
      this.iconSelected = icon
    },
    goBackToIcons() {
      this.isVisibleIcons = true
      this.submitted = false
    },
    handlerSetDelete () {
      this.alertConfirmDelete = true
    },
    handlerConfirmDelete () {
      this.alertConfirmDelete = false
      this.$emit('confirmDelete', JSON.parse(JSON.stringify(this.holiday)) as HolidayInterface)
    }
  },
  computed: {
    iconsComputed: function () {
      return this.icons.map((_icon: IConInterface) => ({
          ..._icon,
          iconLabel: _icon.iconName + ' ' + _icon.iconSvg
      }));
    }
  },
  watch: {
    'holiday.holidayIconId': function (val: string) {
      this.holiday.holidayIcon = this.getHolidayIcon(Number(val))
    },
  }
});
