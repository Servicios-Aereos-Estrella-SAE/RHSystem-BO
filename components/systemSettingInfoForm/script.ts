import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SystemSettingInterface } from '~/resources/scripts/interfaces/SystemSettingInterface'
import SystemSettingService from '~/resources/scripts/services/SystemSettingService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'systemSettingInfoForm',
  props: {
    systemSetting: { type: Object as PropType<SystemSettingInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    currenSystemSetting: null as SystemSettingInterface | null,
    isNewSystemSetting: false,
    isReady: false,
    files: [] as Array<any>,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewSystemSetting = !this.systemSetting.systemSettingId ? true : false
    let isActive: number = 1
    isActive = this.systemSetting.systemSettingActive ? this.systemSetting.systemSettingActive : 0
    this.activeSwicht = isActive === 1 ? true : false
    this.isReady = true
  },
  methods: {
    onUpload(event: any) {
      this.systemSetting.systemSettingPhoto = event.files[0];
    },
    onSelect(event: any) {
      this.systemSetting.systemSettingPhoto = event.files[0];
    },
    async onSave() {
      this.submitted = true
      const systemSettingService = new SystemSettingService()
      if (!systemSettingService.validateSystemSettingInfo(this.systemSetting)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }

      if (this.files.length > 1) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Image invalid',
          detail: 'Only one image is allowed',
          life: 5000,
        })
        return
      }
      for await (const file of this.files) {
        if (file) {
          const mimeType = file.type;
          const isImage = mimeType.startsWith('image/');
          const allowedFormats = ['image/png', 'image/webp', 'image/svg+xml'];
      
          if (!isImage || !allowedFormats.includes(mimeType)) {
            this.$toast.add({
              severity: 'warn',
              summary: 'Invalid Image',
              detail: 'Only .png, .webp, and .svg images are allowed.',
              life: 5000,
            });
            return;
          }
        }
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.systemSetting) {
        this.systemSetting.systemSettingActive = this.activeSwicht ? 1 : 0
        let systemSettingResponse = null
        const image = this.files.length > 0 ? this.files[0] : null
        if (!this.systemSetting.systemSettingId) {
          systemSettingResponse = await systemSettingService.store(this.systemSetting, image)
        } else {
          systemSettingResponse = await systemSettingService.update(this.systemSetting, image)
        }
        if (systemSettingResponse.status === 201 || systemSettingResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `System setting ${this.systemSetting.systemSettingId ? 'updated' : 'created'}`,
            detail: systemSettingResponse._data.message,
              life: 5000,
          })
          systemSettingResponse = await systemSettingService.show(systemSettingResponse._data.data.systemSetting.systemSettingId)
          if (systemSettingResponse?.status === 200) {
            const systemSetting = systemSettingResponse._data.data.systemSetting
            this.$emit('save', systemSetting as SystemSettingInterface)
          }
        } else {
          const msgError = systemSettingResponse._data.error ? systemSettingResponse._data.error : systemSettingResponse._data.message
          this.$toast.add({
            severity: 'warn',
            summary: `System setting ${this.systemSetting.systemSettingId ? 'updated' : 'created'}`,
            detail: msgError,
              life: 5000,
          })
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: `System setting`,
          detail: 'System setting not found',
            life: 5000,
        })
      }
      myGeneralStore.setFullLoader(false)
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
  },
})