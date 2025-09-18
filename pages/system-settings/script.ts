import type { SystemSettingInterface } from "~/resources/scripts/interfaces/SystemSettingInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import SystemSettingService from "~/resources/scripts/services/SystemSettingService";
import { useMyGeneralStore } from "~/store/general";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
export default defineComponent({
  name: 'SystemSettings',
  props: {},
  data: () => ({
    search: '' as string,
    filteredSystemSettings: [] as SystemSettingInterface[],
    systemSetting: null as SystemSettingInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 50,
    drawerSystemSettingForm: false,
    drawerSystemSettingPhotoForm: false,
    drawerSystemSettingDelete: false,
    drawerSystemSettingSync: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false
  }),
  computed: {},
  created() { },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const systemModuleSlug = this.$route.path.replace(`/${this.$i18n.locale}/`, "/").toString().replaceAll('/', '')
    const permissions = await myGeneralStore.getAccess(systemModuleSlug)
    if (myGeneralStore.isRoot) {
      this.canCreate = true
      this.canUpdate = true
      this.canDelete = true
    } else {
      this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
      this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
      this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
    }
    myGeneralStore.setFullLoader(false)
    this.handlerSearchSystemSetting();
  },
  methods: {
    async handlerSearchSystemSetting() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new SystemSettingService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.systemSettings.data : [];
      // this.totalRecords = response.status === 200 ? response._data.data.systemSettings.meta.total : 0;
      // this.first = response.status === 200 ? response._data.data.systemSettings.meta.first_page : 0;
      this.filteredSystemSettings = list;
      myGeneralStore.setFullLoader(false)
    },
    onPhoto(systemSetting: SystemSettingInterface) {
      this.systemSetting = { ...systemSetting };
      this.drawerSystemSettingPhotoForm = true;
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchSystemSetting();
    },
    addNew() {
      const newSystemSetting: SystemSettingInterface = {
        systemSettingId: null,
        systemSettingTradeName: null,
        systemSettingLogo: null,
        systemSettingBanner: null,
        systemSettingSidebarColor: null,
        systemSettingActive: 1,
        systemSettingCreatedAt: new Date(),
        systemSettingUpdatedAt: new Date(),
        systemSettingDeletedAt: null
      }
      this.systemSetting = newSystemSetting
      this.drawerSystemSettingForm = true
    },
    onEdit(systemSetting: SystemSettingInterface) {
      this.systemSetting = { ...systemSetting };
      this.drawerSystemSettingForm = true;
    },
    onDelete(systemSetting: SystemSettingInterface) {
      this.systemSetting = { ...systemSetting };
      this.drawerSystemSettingDelete = true;
    },
    async confirmDelete() {
      if (this.systemSetting) {
        this.drawerSystemSettingDelete = false;
        const systemSettingService = new SystemSettingService();
        const systemSettingResponse = await systemSettingService.delete(this.systemSetting);
        if (systemSettingResponse.status === 200) {
          const index = this.filteredSystemSettings.findIndex((systemSetting: SystemSettingInterface) => systemSetting.systemSettingId === this.systemSetting?.systemSettingId);
          if (index !== -1) {
            this.filteredSystemSettings.splice(index, 1);
            this.$forceUpdate();
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete system setting',
            detail: systemSettingResponse._data.message,
            life: 5000,
          });
          const myGeneralStore = useMyGeneralStore()
          myGeneralStore.getSystemSettings()
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete system setting',
            detail: systemSettingResponse._data.message,
            life: 5000,
          });
        }
      }
    },
    onSave(systemSetting: SystemSettingInterface) {
      this.systemSetting = { ...systemSetting };
      const index = this.filteredSystemSettings.findIndex((s: SystemSettingInterface) => s.systemSettingId === this.systemSetting?.systemSettingId);
      if (index !== -1) {
        this.filteredSystemSettings[index] = systemSetting;
        this.$forceUpdate();
      } else {
        this.filteredSystemSettings.push(systemSetting);
        this.$forceUpdate();
      }
      this.drawerSystemSettingForm = false;
      this.drawerSystemSettingPhotoForm = false;
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.getSystemSettings()
    },
  }
});
