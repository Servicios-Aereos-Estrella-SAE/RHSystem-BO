import type { DateTime } from "luxon"

interface AssistSyncStatus {

    assistStatusSyncs: {
        id: number,
        dateRequestSync: DateTime,
        dateTimeStartSync: DateTime,
        statusSync: string,
        pageTotalSync: number,
        itemsTotalSync: number,
        createdAt: DateTime,
        updatedAt: DateTime
    },
    lastAssistPageSync: {
        id: number,
        statusSyncId: number,
        pageNumber: number,
        pageStatus: string,
        itemsCount: number,
        createdAt: DateTime,
        updatedAt: DateTime
    },
    paginationApiBiometrics: {
        totalItems: number,
        page: number,
        pageSize: number,
        totalPages: number,
        DateParam: DateTime
    }

}

export type { AssistSyncStatus }
