import { defineComponent, ref, onMounted } from 'vue'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import html2canvas from 'html2canvas'
import Department from '~/resources/scripts/models/Department'
import { useMyGeneralStore } from '~/store/general'
import Position from '~/resources/scripts/models/Position'

export default defineComponent({
  name: 'PageOrganizationChart',
  setup() {
    const data = ref(null as IChartNode | null)
    const search = ref('' as string)
    const currentPage = ref(1 as number)
    const rowsPerPage = ref(9999 as number)
    const expandedKeys = ref({} as any)
    const nodes = ref([] as IChartNode[])
    const visibleDialogTypeForm = ref(false as boolean)
    const department = ref(new Department() as DepartmentInterface)
    const displayDepartmentSidebarForm = ref(false as boolean)
    const nodeSelected = ref(null as IChartNode | null)
    const dialogConfirmDeleteNode = ref(false as boolean)
    const drawerNodeForceDelete = ref(false as boolean)

    const displayPositionSidebarForm = ref(false as boolean)
    const position = ref(new Position() as PositionInterface)
    const drawerSoftPositionDelete = ref(false as boolean)

    const enum ENodeType {
      department,
      position
    }
    interface IChartNode {
      key: number
      type: string
      styleClass: string
      label: string
      data: DepartmentInterface | PositionInterface
      meta: { node_type: keyof typeof ENodeType, parent_node: any }
      children: IChartNode[]
    }

    onMounted(async () => {
      await init()
    })

    const init = async () => {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await fetchData()
      expandAll()

      department.value = new Department()
      position.value = new Position()
      nodeSelected.value = null
      myGeneralStore.setFullLoader(false)
    }

    const expandAll = () => {
      for (let node of nodes.value) {
        expandNode(node)
      }

      expandedKeys.value = { ...expandedKeys.value }
    }

    const collapseAll = () => {
      expandedKeys.value = {}
    }

    const fetchData  = async () => {
      try {
        const response = await new DepartmentService().getSearchOrganization(search.value, currentPage.value, rowsPerPage.value)
        const department = response._data.data.departments[0]

        newMapDepartments(department)

        if (data.value) {
          nodes.value = [data.value]
        }
      } catch (error) {
        console.error('Error fetching department data', error)
      }
    }

    const getNodeStyle = (dpNode: IChartNode) => {
      const department: DepartmentInterface = dpNode.data as DepartmentInterface
      const position: PositionInterface = dpNode.data as PositionInterface

      if (dpNode.meta.node_type === 'department') {
        const sufix = department.departmentName.split('(')
        const sufixLetter = sufix.length > 1 ? sufix[1].slice(0, 2) : ''
        return `level${sufixLetter}`
      }

      if (dpNode.meta.node_type === 'position') {
        const sufix = position.positionName.split('(')
        const sufixLetter = sufix.length > 1 ? sufix[1].slice(0, 2) : ''
        return `level${sufixLetter}`
      }

      return ''
    }

    const onNodeDblClick = (node: any) => {
      console.log('🚀 ----------------------------🚀')
      console.log('🚀 ~ onNodeSelect ~ node:', node)
      console.log('🚀 ----------------------------🚀')
    }

    const newMapDepartments = (department: DepartmentInterface) => {
      const departmentItem = JSON.parse(JSON.stringify(department)) as DepartmentInterface
      let chartNodeList: IChartNode | null = null

      const chartNode: IChartNode = {
        key: Math.round(Math.random() * new Date().getTime()),
        type: 'organization',
        styleClass: '',
        label: '',
        data: departmentItem,
        meta: { node_type: 'department', parent_node: null },
        children: setInitialChildrenNodes(departmentItem)
      }

      chartNode.label = setNodeName(chartNode).name
      chartNode.styleClass = getNodeStyle(chartNode)

      chartNodeList = chartNode
      data.value = chartNodeList
    }

    const setInitialChildrenNodes = (departmentNode: DepartmentInterface) => {
      const childrenNodes: IChartNode[] = []

      departmentNode.departments?.forEach((depto: DepartmentInterface) => {
        const chartNode: IChartNode = {
          key: Math.round(Math.random() * new Date().getTime()),
          type: 'organization',
          styleClass: '',
          label: '',
          data: depto,
          meta: { node_type: 'department', parent_node: departmentNode },
          children: []
        }

        chartNode.label = setNodeName(chartNode).name
        chartNode.styleClass = getNodeStyle(chartNode)
        childrenNodes.push(chartNode)
      })

      childrenNodes.forEach(chNode => {
        chNode.styleClass = getNodeStyle(chNode)
        chNode.children = setChildrenNodes(chNode)

        const department: DepartmentInterface = chNode.data as DepartmentInterface

        if (department.departmentPositions && department.departmentPositions.length > 0) {
          department.departmentPositions.forEach(pos => {
            const positionObj = pos.position as PositionInterface

            if (positionObj && !(positionObj.parentPositionId)) {
              const chartPosNode: IChartNode = {
                key: Math.round(Math.random() * new Date().getTime()),
                type: 'organization',
                styleClass: '',
                label: '',
                data: positionObj,
                meta: { node_type: 'position', parent_node: pos },
                children: []
              }

              chartPosNode.label = setNodeName(chartPosNode).name
              chartPosNode.styleClass = getNodeStyle(chartPosNode)

              if (positionObj.positions && positionObj.positions.length > 0) {
                positionObj.positions.forEach(item => {
                  chartPosNode.styleClass = getNodeStyle(chartPosNode)
                  chartPosNode.children = setChildrenNodes(chartPosNode)
                })
              }

              chNode.children.push(chartPosNode)
            }
          })
        }
      })

      return childrenNodes
    }

    const setChildrenNodes = (dpNode: IChartNode) => {
      const department: DepartmentInterface = dpNode.data as DepartmentInterface
      const position: PositionInterface = dpNode.data as PositionInterface
      const nodes: IChartNode[] = []

      if (dpNode.meta.node_type === 'department'){
        department.departments?.forEach((depto: DepartmentInterface) => {
          const chartNode: IChartNode = {
            key: Math.round(Math.random() * new Date().getTime()),
            type: 'organization',
            styleClass: '',
            label: '',
            data: depto,
            meta: { node_type: 'department', parent_node: dpNode.data },
            children: []
          }

          chartNode.label = setNodeName(chartNode).name
          chartNode.styleClass = getNodeStyle(chartNode)

          if (depto.departments && depto.departments.length > 0) {
            depto.departments.forEach(item => {
              chartNode.styleClass = getNodeStyle(chartNode)
              chartNode.children = setChildrenNodes(chartNode)
            })
          }

          if (depto.departmentPositions && depto.departmentPositions.length > 0) {
            depto.departmentPositions.forEach(pos => {
              const positionObj = pos.position as PositionInterface

              if (positionObj && !(positionObj.parentPositionId)) {
                const chartPosNode: IChartNode = {
                  key: Math.round(Math.random() * new Date().getTime()),
                  type: 'organization',
                  styleClass: '',
                  label: '',
                  data: positionObj,
                  meta: { node_type: 'position', parent_node: pos },
                  children: []
                }

                chartPosNode.label = setNodeName(chartPosNode).name
                chartPosNode.styleClass = getNodeStyle(chartPosNode)

                if (positionObj.positions && positionObj.positions.length > 0) {
                  positionObj.positions.forEach(item => {
                    chartPosNode.styleClass = getNodeStyle(chartPosNode)
                    chartPosNode.children = setChildrenNodes(chartPosNode)
                  })
                }

                chartNode.children.push(chartPosNode)
              }
            })
          }

          nodes.push(chartNode)
        })
      }

      if (dpNode.meta.node_type === 'position'){
        position.positions?.forEach((pos: PositionInterface) => {
          const chartNode: IChartNode = {
            key: Math.round(Math.random() * new Date().getTime()),
            type: 'organization',
            styleClass: '',
            label: '',
            data: pos,
            meta: { node_type: 'position', parent_node: position },
            children: []
          }

          chartNode.label = setNodeName(chartNode).name
          chartNode.styleClass = getNodeStyle(chartNode)

          if (pos.positions && pos.positions.length > 0) {
            pos.positions.forEach(item => {
              chartNode.styleClass = getNodeStyle(chartNode)
              chartNode.children = setChildrenNodes(chartNode)
            })
          }

          nodes.push(chartNode)
        })
      }

      return nodes
    }

    const setNodeName = (node: IChartNode) => {
      if (node.meta.node_type === 'department') {
        const department = node.data as DepartmentInterface
        const splitted = department.departmentName.split(' ')

        if (splitted.length === 1) {
          return { clear_name: splitted[0], name: splitted[0] }
        }

        const name = splitted.map((text, i) => i > 0 ? text : '').join(' ')
        return { clear_name: name, name: department.departmentName }
      }

      if (node.meta.node_type === 'position') {
        const position = node.data as PositionInterface
        const splitted = position.positionName.split(' ')

        if (splitted.length === 1) {
          return { clear_name: splitted[0], name: splitted[0] }
        }

        const name = splitted.map((text: string, i: number) => i > 0 ? text : '').join(' ')
        return { clear_name: name, name: position.positionName }
      }

      return { clear_name: '', name: '' }
    }

    const exportChart = async () => {
      const contenido = document.getElementById('contenido')

      if (!contenido) {
        return
      }

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      try {
        const canvas = await html2canvas(contenido, {
          scale: 2,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          width: contenido.scrollWidth,
          height: contenido.scrollHeight
        })

        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')

        link.href = dataUrl
        link.download = 'contenido-completo.png'
        link.click()
      } catch (error) {
        console.error('Error al exportar:', error)
      }

      myGeneralStore.setFullLoader(false)
    }

    const expandNode = (node: IChartNode) => {
      if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.children) {
            expandNode(child);
        }
      }
    }

    const handlerDisplayForm = (node: IChartNode) => {
      nodeSelected.value = node

      if (nodeSelected.value.meta.node_type === 'position') {
        handlerNewNode('new-position')
        return
      }

      visibleDialogTypeForm.value = true
    }

    const handlerEditNode = (node: IChartNode) => {
      nodeSelected.value = node
      if (nodeSelected.value) {
        if (nodeSelected.value.meta.node_type === 'department') {
          const departmentSelected = nodeSelected.value.data as DepartmentInterface
          department.value = departmentSelected
          displayDepartmentSidebarForm.value = true
        }

        if (nodeSelected.value.meta.node_type === 'position') {
          const positionSelected = nodeSelected.value.data as PositionInterface
          position.value = positionSelected

          if (positionSelected.parentPositionId) {
            position.value.parentPosition = nodeSelected.value.meta.parent_node
          }

          console.log('🚀 -----------------------------------------🚀')
            console.log('🚀 ~ handlerEditNode ~ position:', position)
            console.log('🚀 -----------------------------------------🚀')

          displayPositionSidebarForm.value = true
        }
      }
    }

    const handlerNewNode = (action: String) => {
      if (nodeSelected.value) {
        if (nodeSelected.value.meta.node_type === 'department') {
          const departmentSelected = nodeSelected.value.data as DepartmentInterface
          department.value = new Department()
          department.value.parentDepartmentId = departmentSelected.departmentId

          if (action === 'new-department') {
            displayDepartmentSidebarForm.value = true
          }

          if (action === 'new-position') {
            position.value = new Position()
            position.value.departmentId = departmentSelected.departmentId
            displayPositionSidebarForm.value = true
          }
        }

        if (nodeSelected.value.meta.node_type === 'position') {
          const positionSelected = nodeSelected.value.data as PositionInterface
          position.value = new Position()
          position.value.departmentId = positionSelected.departmentId
          position.value.parentPositionId = positionSelected.positionId
          position.value.parentPosition = positionSelected

          if (action === 'new-position') {
            displayPositionSidebarForm.value = true
          }
        }

        visibleDialogTypeForm.value = false
      }
    }

    const onDepartmentSave = async () => {
      displayDepartmentSidebarForm.value = false
      await init()
    }

    const handlerDeleteNode = (node: IChartNode) => {
      if (node.meta.node_type === 'department') {
        const departmentSelected = node.data as DepartmentInterface
        department.value = departmentSelected
        dialogConfirmDeleteNode.value = true
      }

      if (node.meta.node_type === 'position') {
        const positionSelected = node.data as PositionInterface
        position.value = positionSelected
        drawerSoftPositionDelete.value = true
      }
    }

    const confirmDeleteNode = async () => {
      if (department.value) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)

        dialogConfirmDeleteNode.value = false
        const departmentResponse = await new DepartmentService().delete(department.value)

        if (departmentResponse.status === 201 || departmentResponse.status === 200) {
          await init()
        } else if (departmentResponse.status === 206) {
          // Mostrar la alerta de confirmación cuando existan empleados relacionados al departamento a eliminar
          drawerNodeForceDelete.value = true
        }
      }
    }

    const confirmDepartmentForceDelete = async () => {
      if (department.value) {
        const forceDeleteResponse = await new DepartmentService().forceDelete(department.value)

        if (forceDeleteResponse.status === 201 || forceDeleteResponse.status === 200) {
          await init()
        }

        drawerNodeForceDelete.value = false
      }
    }

    const onPositionSaved = async (position: PositionInterface) => {
      displayPositionSidebarForm.value = false
      await init()
    }

    const confirmSoftDeletePosition = async () => {
      if (position.value) {
        drawerSoftPositionDelete.value = false

        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const departmentService = new DepartmentService()
        await departmentService.softDeleteDepartmentPosition(position.value.positionId || 0)
        await init()
      }
    }

    return {
      data,
      search,
      currentPage,
      rowsPerPage,
      nodes,
      expandedKeys,
      visibleDialogTypeForm,
      displayDepartmentSidebarForm,
      dialogConfirmDeleteNode,
      department,
      drawerNodeForceDelete,
      displayPositionSidebarForm,
      position,
      drawerSoftPositionDelete,
      setNodeName,
      onNodeDblClick,
      exportChart,
      handlerDisplayForm,
      handlerNewNode,
      onDepartmentSave,
      confirmDeleteNode,
      handlerDeleteNode,
      confirmDepartmentForceDelete,
      handlerEditNode,
      onPositionSaved,
      confirmSoftDeletePosition,
      expandAll,

      collapseAll
    }
  }
})
