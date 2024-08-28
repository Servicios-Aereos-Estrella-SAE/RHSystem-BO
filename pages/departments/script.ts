import type { DepartmentInterface } from "~/resources/scripts/interfaces/DepartmentInterface";
import DepartmentService from "~/resources/scripts/services/DepartmentService";
import { useMyGeneralStore } from "~/store/general";
import Department from '../../../API-SAE/app/models/department';

export default defineComponent({
  name: 'Departments',
  props: {},
  data: () => ({
    search: '' as string,
    filteredDepartments: [] as DepartmentInterface[],
    department: null as DepartmentInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 30,
    drawerDepartmentDetail: false,
  }),
  computed: {},
  created () {},
  async mounted() {
    this.handlerSearchDepartment();
  },
  methods: {
    async handlerSearchDepartment() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new DepartmentService().getSearchDepartmentList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.data : [];
    //   this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
    //   this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
      this.filteredDepartments = list;
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newDepartment: DepartmentInterface = {
        departmentId: null,
        departmentCode: "",
        departmentName: "",
        departmentAlias: "",
        departmentIsDefault: "",
        departmentDeletedAt: null,
        parentDepartmentId: null,
        departmentLastSynchronizationAt: null,
        departmentActive: "1",
        departmentSyncId: "",
        parentDepartmentSyncId: "",
        companyId: 1,
        departmentCreatedAt: new Date(),
        departmentUpdatedAt: new Date(),
      }
      this.department = newDepartment
      this.drawerDepartmentDetail = true
    },
    onEdit(department: DepartmentInterface) {
      this.department = { ...department }
      this.drawerDepartmentDetail = true
    },
    onSave(department: DepartmentInterface) {
      this.department = { ...department };
      const index = this.filteredDepartments.findIndex((s: DepartmentInterface) => s.departmentId === this.department?.departmentId);
      if (index !== -1) {
          this.filteredDepartments[index] = department;
          this.$forceUpdate();
      } else {
          this.filteredDepartments.push(department);
          this.$forceUpdate();
      }
      this.drawerDepartmentDetail = false;
    },
    async syncDepartments() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      try {
        const response = await new DepartmentService().syncDepartments();
        if (response.status === 200) {
          // Actualiza los departamentos o maneja la respuesta según sea necesario
          this.handlerSearchDepartment(); // Actualiza la lista de departamentos
        } else {
          console.error('Synchronization failed:', response._data);
        }
      } catch (error) {
        console.error('Error synchronizing departments:', error);
      } finally {
        myGeneralStore.setFullLoader(false);
      }
    },
  }
});
