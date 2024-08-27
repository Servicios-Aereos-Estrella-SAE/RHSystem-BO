import type { SystemSettingInterface } from "~/resources/scripts/interfaces/SystemSettingInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import SystemSettingService from "~/resources/scripts/services/SystemSettingService";
import { useMyGeneralStore } from "~/store/general";
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
        drawerSystemSettingSync: false
    }),
    computed: {},
    created() { },
    async mounted() {
        this.handlerSearchSystemSetting();
    },
    methods: {
        async handlerSearchSystemSetting() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new SystemSettingService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.systemSettings.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.systemSettings.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.systemSettings.meta.first_page : 0;
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
