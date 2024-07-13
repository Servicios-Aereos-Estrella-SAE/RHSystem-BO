import type { DepartmentInterface } from "~/resources/scripts/interfaces/DepartmentInterface";
import DepartmentService from "~/resources/scripts/services/DepartmentService";
import { useMyGeneralStore } from "~/store/general";

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
   


  }
});
