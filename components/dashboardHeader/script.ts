import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import { useMyGeneralStore } from '~/store/general'
import ShiftExceptionRequestService from "~/resources/scripts/services/ShiftExceptionService";

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
    authUser: null as UserInterface | null,
    drawerNotifications: false,
    notifications: [], 
    totalNotifications: 0,
    search: '',
    selectedDepartmentId: null,
    selectedPositionId: null,
    currentPage: 1,
    rowsPerPage: 10,
  }),
  computed: {
    getBackgroundImage(){
      const myGeneralStore = useMyGeneralStore()
      const backgroundImage = myGeneralStore.backgroundImage
      return backgroundImage
    },
    displayBackButton () {
      const path = this.$route.fullPath
      const isRoot = path.split('/').length > 2
      return isRoot
    },
    avatarLetter () {
      const initial = `${this.authUser?.userEmail?.charAt(0) || ''}`.toLocaleUpperCase()
      return initial
    },
    avatarImage () {
      const initial = `${this.authUser?.person?.employee?.employeePhoto || ''}`
      return initial
    }
  },
  created () {
  },
 async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.getSystemSettings()
    // this.setAuthUser()
    const { getSession } = useAuth()

    const session: unknown = await getSession()
    this.authUser = session as UserInterface
    this.handlerFetchNotifications();

  },
  methods: {
    async setAuthUser () {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.authUser = authUser
    },
    async toggleAside () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.toggleDisplayAside()
    },
    handlerBack () {
      this.$router.go(-1)
    },
    toggleNotification(){
      this.drawerNotifications = true
    },
    async handlerFetchNotifications() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      try {
        const response = await new ShiftExceptionRequestService().getFilteredList({
          search: '',
          departmentId: null,
          positionId: null,
          status: 'pending',
          page: this.currentPage || 1, 
          limit: this.rowsPerPage || 30,
        });
        this.notifications = response.data; 
        const rawNotifications = response.data.map((item: any) => ({
          exceptionRequestId: item.exceptionRequestId,
          type: item.exceptionType?.exceptionTypeTypeName || 'Unknown',
          department: item.employee?.department?.departmentName || 'Unknown',
          handling: item.employee?.department?.departmentAlias || 'N/A',
          position: item.employee?.position?.positionName || 'Unknown',
          employeeName: `${item.employee?.employeeFirstName || ''} ${item.employee?.employeeLastName || ''}`.trim(),
          dateRequested: item.requestedDate,
          description: item.exceptionRequestDescription || '',
          status: item.exceptionRequestStatus || 'unknown',
          readRh: item.exceptionRequestRhRead || 0,
          readGerencial: item.exceptionRequestGerencialRead || 0,
        }));
  
        this.notifications = rawNotifications.filter((item: { readGerencial: number; }) => {
          const excludeByManager = this.authUser?.roleId !== 2 && item.readGerencial === 1;
          const excludeByRH = this.authUser?.roleId === 2 && item.readGerencial === 0;
          if (excludeByManager || excludeByRH) {
            return false; // Excluir el elemento
          }
  
          return true; // Incluir el elemento
        });
  
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
        this.notifications = [];
      } finally {
        myGeneralStore.setFullLoader(false);
      }
    },
    async handlerLogout() {
      try {
        const { signOut } = useAuth()
        await signOut({ callbackUrl: '/' })
      } catch (error) {
        console.error('🚀 ---------------------------------🚀')
        console.error('🚀 ~ handlerLogout ~ error:', error)
        console.error('🚀 ---------------------------------🚀')
      }
    },
  }
})