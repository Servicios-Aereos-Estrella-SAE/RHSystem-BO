import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import { useMyGeneralStore } from '~/store/general'
import ShiftExceptionRequestService from "~/resources/scripts/services/ShiftExceptionService";
import { io } from 'socket.io-client'
import type { NotificationInterface } from '~/resources/scripts/interfaces/NotificationInterface';

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
    socketIO: null as any,
    authUser: null as UserInterface | null,
    drawerNotifications: false,
    notifications: [] as Array<NotificationInterface>, 
    totalNotifications: 0,
    search: '',
    selectedDepartmentId: null,
    selectedPositionId: null,
    currentPage: 1,
    rowsPerPage: 10,
    notificationAudio: null as HTMLAudioElement | null,
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
  this.notificationAudio = new Audio('/sounds/notification-sound.mp3')
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.getSystemSettings()
    // this.setAuthUser()
    const { getSession } = useAuth()

    const session: unknown = await getSession()
    this.authUser = session as UserInterface
    this.socketIO = io(this.$config.public.SOCKET)
    if (this.authUser?.role?.roleSlug === 'rh-manager') {
      this.socketIO.on('new-exception-request', async () => {
        await this.handlerFetchNotifications()
        this.playNotificationSound()
        let message = 'There is a new exception request'
        if (this.notifications.length > 0) {
          const lastNotification = this.notifications[this.notifications.length - 1]
          message = `${lastNotification.personWhoCreatesIt} request a new shift exception to ${lastNotification.employeeName}`
        }
        this.notificationDesktop('SAE, New exception request', message)
        this.$toast.add({
          severity: 'info',
          summary: 'Exception request',
          detail: 'There is a new exception request',
          life: 5000,
        });
      })
    }
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
        this.notifications = response.data
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
          personWhoCreatesIt: `${item.user.person.personFirstname || ''} ${item.user.person.personLastname || ''} ${item.user.person.personSecondLastname || ''}`.trim(),
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
    notificationDesktop(title: string, text: string) {
      const options = {
        body: text,
        icon: '/isotipo-v1-loader.png',
      }
      if (!("Notification" in window)) {
      } else if (Notification.permission === "granted") {
        const notification = new Notification(title, options)
        notification.onclick = () => {
          const baseUrl = '/exception-requests'
          window.location.href = `${baseUrl}`
          notification.close()
        }
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(title, options)
            notification.onclick = () => {
              const baseUrl = '/exception-requests'
              window.location.href = `${baseUrl}`
              notification.close()
            }
          }
        })
      }
    },
    playNotificationSound() {
      if (this.notificationAudio) {
        this.notificationAudio.currentTime = 0
        this.notificationAudio.play()
          .then()
          .catch(error => console.error('Error play sound sonido:', error));
      }
    },
  }
})