import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { DateTime } from 'luxon'
import type { NotificationInterface } from '~/resources/scripts/interfaces/NotificationInterface'

export default defineComponent({
  name: 'NotificationCard',
  props: {
    notifications: { type: Array as PropType<NotificationInterface[]>, required: true }
  },
  computed: {
    filteredNotifications() {
      return this.notifications.filter(
        (item) =>  item.status !== '01'
      )
    }
  },
  methods: {
    formatDate(date: string): string {
      const dateObject = DateTime.fromISO(date, { setZone: true })
      return dateObject.toLocaleString(DateTime.DATE_FULL)
    },
    redirectToModule(id: number): void {
        const baseUrl = '/exception-requests';
        window.location.href = `${baseUrl}`;
      },
    statusClass(status: string): string {
      return status === 'pending' ? 'status-pending' : 'status-default'
    }
  }
})
