import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import { useMyGeneralStore } from '~/store/general'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'

export default defineComponent({
  name: 'DepartmentDetail',
  setup() {
    const toast = useToast()
    const route = useRoute()
    const department = ref<DepartmentInterface | null>(null)
    const subDepartment = ref<DepartmentInterface | null>(null)
    const positions = ref<PositionInterface[]>([])
    const position = ref<PositionInterface | null>(null)
    const drawerPositionDelete = ref<boolean>(false)
    const search = ref<string>('')
    const drawerNewDepartmentForm = ref<boolean>(false)
    const drawerNewPositionForm = ref<boolean>(false)
    const drawerDepartmentDelete = ref<boolean>(false)
    const drawerDepartmentForceDelete = ref<boolean>(false)
    const drawerSoftPositionDelete = ref<boolean>(false)
    const alertDeletePosition = ref<boolean>(false)
    const messagePosition = ref<string>('')
    const subdepartmentList = ref<DepartmentInterface[]>([])


    let canRead = ref<boolean>(false)
    let canCreate = ref<boolean>(false)
    let canUpdate = ref<boolean>(false)
    let canDelete = ref<boolean>(false)

    onMounted(async () => {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await setPrivileges()
      await Promise.all([
        getDepartment(),
        fetchPositions()
      ])

      myGeneralStore.setFullLoader(false)
    })

    const setPrivileges = async () => {
      const myGeneralStore = useMyGeneralStore()
      const permissions = await myGeneralStore.getAccess('positions')

      if (myGeneralStore.isRoot) {
        canRead.value = true
        canCreate.value = true
        canUpdate.value = true
        canDelete.value = true
      } else {
        canRead.value = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
        canCreate.value = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
        canUpdate.value = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
        canDelete.value = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
      }
    }

    const getDepartment = async () => {
      const departmentId = route.params.departmentId ? route.params.departmentId.toString() : null

      if (!departmentId || isNaN(parseInt(departmentId))) {
        throw showError({
          statusCode: 404,
          fatal: true,
          message: 'Department not found'
        })
      }

      const departmentResponse = await new DepartmentService().show(parseInt(departmentId))
      department.value = departmentResponse.status === 200 ? departmentResponse._data.data.department : null
      subdepartmentList.value = departmentResponse.status === 200 && department.value?.subDepartments ? department.value?.subDepartments : []
    }

    const fetchPositions = async () => {
      const departmentId = route.params.departmentId ? route.params.departmentId.toString() : null

      if (!departmentId || isNaN(parseInt(departmentId))) {
        throw showError({
          statusCode: 404,
          fatal: true,
          message: 'Department not found'
       })
      }

      const positionsResponse = await new DepartmentService().getDepartmentPositions(parseInt(departmentId))
      positions.value = positionsResponse.status === 200 ? positionsResponse._data.data.positions.map((item: any) => item.position) : []
    }

    const handlerSearchPosition = () => {
      const departmentId = route.params.departmentId ? route.params.departmentId.toString() : null
      if (departmentId) {
        // fetchPositions(departmentId, search.value)
      } else {
        console.error('Department ID is undefined')
      }
    }

    const handleSaveSuccess = () => {
    }

    const onSave = (department: DepartmentInterface) => {
      const index = subdepartmentList.value.findIndex((s: DepartmentInterface) => s.departmentId === department?.departmentId)
      if (index !== -1) {
        subdepartmentList.value[index] = department
      } else {
        subdepartmentList.value.push(department)
      }
      drawerNewDepartmentForm.value = false
    }

    const onEditDepartment = (department: DepartmentInterface) => {
      subDepartment.value = { ...department }
      drawerNewDepartmentForm.value = true
    }

    const onDeleteDepartment = (department: DepartmentInterface) => {
      subDepartment.value = { ...department }
      drawerDepartmentDelete.value = true
    }

    const newDepartment = () =>{
      const departmentIds = route.params.departmentId
      const newDepartment: DepartmentInterface = {
        departmentId: null,
        departmentCode: "",
        departmentName: "",
        departmentAlias: "",
        departmentIsDefault: "",
        departmentDeletedAt: null,
        parentDepartmentId: parseInt(departmentIds.toString()),
        businessUnitId: 1,
        departmentLastSynchronizationAt: null,
        departmentActive: "1",
        departmentSyncId: "",
        parentDepartmentSyncId: "",
        companyId: 1,
        departmentCreatedAt: new Date(),
        departmentUpdatedAt: new Date(),
      }

      subDepartment.value = newDepartment
      drawerNewDepartmentForm.value = true
    }

    const confirmDeleteDepartment = async () => {
      if (subDepartment.value) {
        const departmentService = new DepartmentService()
        drawerDepartmentDelete.value = false 
        const departmentResponse = await departmentService.delete(subDepartment.value) 
    
        if (departmentResponse.status === 201 || departmentResponse.status === 200) {
          const index = subdepartmentList.value.findIndex((department: DepartmentInterface) => department.departmentId === subDepartment.value?.departmentId)
          if (index !== -1) {
            subdepartmentList.value.splice(index, 1)
          }
          toast.add({
            severity: 'success',
            summary: 'Delete department',
            detail: departmentResponse._data.message, 
            life: 5000,
          })
        } 
        else if (departmentResponse.status === 206) {
          // Mostrar la alerta de confirmación cuando haya empleados relacionados
          drawerDepartmentForceDelete.value = true
        } 
        else {
          toast.add({
            severity: 'error',
            summary: 'Delete department',
            detail: departmentResponse._data.message, 
            life: 5000,
          })
        }
      }
    }
     const confirmForceDelete = async () => {
      if (subDepartment.value) {
        const departmentService = new DepartmentService()
        const forceDeleteResponse = await departmentService.forceDelete(subDepartment.value)
        if (forceDeleteResponse.status === 201 || forceDeleteResponse.status === 200) {
          // Eliminar el departamento de la lista
          removeDepartmentFromList()
          toast.add({
            severity: 'success',
            summary: 'Department Force Deleted',
            detail: forceDeleteResponse._data.message,
            life: 5000,
          })
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error Force Deleting Department',
            detail: forceDeleteResponse._data.message,
            life: 5000,
          })
        }
        drawerDepartmentForceDelete.value = false // Cerrar el diálogo de eliminación forzada
      }
    }
    const removeDepartmentFromList = () => {
      const index = subdepartmentList.value.findIndex(
        (department: DepartmentInterface) => department.departmentId === subDepartment.value?.departmentId
      )
      if (index !== -1) {
        subdepartmentList.value.splice(index, 1)
      }
    }

    const newPositionDepartment = () =>{
      const departmentIds = route.params.departmentId
      const newPosition: PositionInterface = {
        positionId: 0,
        positionSyncId: '',
        positionCode: '',
        positionName: '',
        positionAlias: '',
        positionIsDefault: 0,
        businessUnitId: 0,
        positionActive: 0,
        parentPositionId: null,
        parentPositionSyncId: '',
        companyId: null,
        departmentId: departmentIds,
        positionLastSynchronizationAt: null,
        positionCreatedAt: null,
        positionUpdatedAt: null,
        positionDeletedAt: null
      }

      position.value = newPosition
      drawerNewPositionForm.value = true
    }

    const onPositionSaved = async (position: PositionInterface) => {
      drawerNewPositionForm.value = false
      const positionIndex = positions.value.findIndex(p => p.positionId === position.positionId)

      if (positionIndex >= 0) {
        positions.value[positionIndex] = position
      } else {
        positions.value.push(position)
      }
    }

    const onEdit = (_position: any) => {
      if (_position.position) {
        position.value = {
          ..._position.position,  
          departmentPositionId: _position.departmentPositionId,
          departmentId: _position.departmentId,
          departmentPositionLastSynchronizationAt: _position.departmentPositionLastSynchronizationAt,
          departmentPositionCreatedAt: _position.departmentPositionCreatedAt,
          departmentPositionUpdatedAt: _position.departmentPositionUpdatedAt,
          deletedAt: _position.deletedAt,
        }
      } else {
        position.value = { ..._position }
      }
    
      drawerNewPositionForm.value = true 
    }

    const onDeletePosition = (_position: PositionInterface) => {
      position.value = { ..._position }
      drawerPositionDelete.value = true
    }

    const confirmSoftDelete = async () => {
      if (position.value) {
        drawerSoftPositionDelete.value = false 
        
        const departmentService = new DepartmentService()
        const departmentPositionResponse = await departmentService.softDeleteDepartmentPosition(position.value.positionId)

        return departmentPositionResponse
      }
    }
    
    const confirmDelete = async () => {
      if (position.value) {
        drawerPositionDelete.value = false
        
        const departmentId = route.params.departmentId ? route.params.departmentId.toString() : null
        const departmentService = new DepartmentService()
        const departmentPositionResponse = await departmentService.unAssignDepartment(position.value.positionId, parseInt(departmentId ?? '0'))

        if (departmentPositionResponse.status !== 201) {
          alertDeletePosition.value = true
          messagePosition.value = departmentPositionResponse.message
        }

        const departmentPositionSoftResponse = await confirmSoftDelete()

        if (departmentPositionSoftResponse.status !== 201) { 
          alertDeletePosition.value = true
          messagePosition.value = departmentPositionResponse.message
        }

        const index = positions.value?.findIndex((_position: PositionInterface) => _position.positionId === position.value?.positionId)
        
          if (index && index >= 0) {
            positions.value.splice(index, 1)
          }
      }
    }

    return {
      toast,
      department,
      subDepartment,
      positions,
      search,
      position,
      drawerPositionDelete,
      drawerSoftPositionDelete,
      alertDeletePosition,
      messagePosition,
      canRead,
      canCreate,
      canUpdate,
      canDelete,
      drawerNewDepartmentForm,
      drawerDepartmentDelete,
      drawerDepartmentForceDelete,
      drawerNewPositionForm,
      subdepartmentList,
      newDepartment,
      newPositionDepartment,
      onEdit,
      onPositionSaved,
      confirmDelete,
      handlerSearchPosition,
      onDeletePosition,
      handleSaveSuccess,
      confirmSoftDelete,
      onSave,
      onEditDepartment,
      onDeleteDepartment,
      confirmDeleteDepartment,
      confirmForceDelete,
    }
  }
})
