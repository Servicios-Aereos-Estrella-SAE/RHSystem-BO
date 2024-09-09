import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import type { VacationInterface } from "~/resources/scripts/interfaces/VacationInterface";
import VacationService from "~/resources/scripts/services/VacationService";
import { useMyGeneralStore } from "~/store/general";

export default defineComponent({
  name: 'Vacations',
  props: {},
  data: () => ({
    search: '' as string,
    filteredVacations: [] as VacationInterface[],
    vacation: null as VacationInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 30,
    drawerVacationForm: false,
    drawerVacationDelete: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false
  }),
  computed: {},
  created() {},
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
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
    this.handlerSearchVacation();
  },
  methods: {
    async handlerSearchVacation() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new VacationService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.data : [];
      this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
      this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
      this.filteredVacations = list;
      myGeneralStore.setFullLoader(false)
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchVacation();
    },
    addNew() {
      const newVacation: VacationInterface = {
        vacationSettingId: null,
        vacationSettingYearsOfService: 0,
        vacationSettingVacationDays: 0,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
      }
      this.vacation = newVacation
      this.drawerVacationForm = true
    },
    onEdit(vacation: VacationInterface) {
      this.vacation = { ...vacation };
      this.drawerVacationForm = true;
    },
    onDelete(vacation: VacationInterface) {
      this.vacation = { ...vacation };
      this.drawerVacationDelete = true;
    },
    async confirmDelete() {
      if (this.vacation) {
        this.drawerVacationDelete = false;
        const vacationService = new VacationService();
        const vacationResponse = await vacationService.delete(this.vacation);
        if (vacationResponse.status === 200) {
          const index = this.filteredVacations.findIndex((vac: VacationInterface) => vac.vacationSettingId === this.vacation?.vacationSettingId);
          if (index !== -1) {
            this.filteredVacations.splice(index, 1);
            this.$forceUpdate();
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete vacation setting',
            detail: vacationResponse._data.message,
            life: 5000,
          });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete vacation setting',
            detail: vacationResponse._data.message,
            life: 5000,
          });
        }
      }
    },
    onSave(vacation: VacationInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.vacation = { ...vacation };
      const index = this.filteredVacations.findIndex((v: VacationInterface) => v.vacationSettingId === this.vacation?.vacationSettingId);
      if (index !== -1) {
        this.filteredVacations[index] = vacation;
        this.$forceUpdate();
        myGeneralStore.setFullLoader(false)
      } else {
        this.filteredVacations.push(vacation);
        this.$forceUpdate();
        myGeneralStore.setFullLoader(false)
      }
      myGeneralStore.setFullLoader(false)
      this.drawerVacationForm = false;
    }
  }
});
