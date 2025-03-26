import { defineComponent, ref, onMounted } from 'vue'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import html2canvas from 'html2canvas'

export default defineComponent({
  name: 'PageOrganizationChart',
  setup() {
    const data = ref(null as IChartNode | null)
    const search = ref('' as string)
    const currentPage = ref(1 as number)
    const rowsPerPage = ref(9999 as number)
    const expandedKeys = ref({})
    const nodes = ref(null)

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
      meta: { node_type: keyof typeof ENodeType }
      children: IChartNode[]
    }

    onMounted(async () => {
      await fetchData()
      nodes.value = [data.value]
      initialExpand()
    })

    async function fetchData () {
      try {
        const response = await new DepartmentService().getSearchOrganization(search.value, currentPage.value, rowsPerPage.value)
        const department = response._data.data.departments[0]

        newMapDepartments(department)
      } catch (error) {
        console.error('Error fetching department data', error)
      }
    }

    function getNodeStyle (dpNode: IChartNode) {
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

    function newMapDepartments (department: DepartmentInterface) {
      const departmentItem = JSON.parse(JSON.stringify(department)) as DepartmentInterface
      let chartNodeList: IChartNode | null = null

      const chartNode: IChartNode = {
        key: Math.round(Math.random() * new Date().getTime()),
        type: 'organization',
        styleClass: '',
        label: '',
        data: { ...departmentItem },
        meta: { node_type: 'department' },
        children: setInitialChildrenNodes(departmentItem)
      }

      chartNode.label = setNodeName(chartNode)
      chartNode.styleClass = getNodeStyle(chartNode)

      chartNodeList = chartNode
      data.value = chartNodeList
    }

    function setInitialChildrenNodes (departmentNode: DepartmentInterface) {
      const childrenNodes: IChartNode[] = []

      departmentNode.departments?.forEach((depto: DepartmentInterface) => {
        const chartNode: IChartNode = {
          key: Math.round(Math.random() * new Date().getTime()),
          type: 'organization',
          styleClass: '',
          label: '',
          data: { ...depto },
          meta: { node_type: 'department' },
          children: []
        }

        chartNode.label = setNodeName(chartNode)
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

            if (!(positionObj.parentPositionId)) {
              const chartPosNode: IChartNode = {
                key: Math.round(Math.random() * new Date().getTime()),
                type: 'organization',
                styleClass: '',
                label: '',
                data: { ...positionObj },
                meta: { node_type: 'position' },
                children: []
              }

              chartPosNode.label = setNodeName(chartPosNode)
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

    function setChildrenNodes (dpNode: IChartNode) {
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
            data: { ...depto },
            meta: { node_type: 'department' },
            children: []
          }

          chartNode.label = setNodeName(chartNode)
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

              if (!(positionObj.parentPositionId)) {
                const chartPosNode: IChartNode = {
                  key: Math.round(Math.random() * new Date().getTime()),
                  type: 'organization',
                  styleClass: '',
                  label: '',
                  data: { ...positionObj },
                  meta: { node_type: 'position' },
                  children: []
                }

                chartPosNode.label = setNodeName(chartPosNode)
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
            data: { ...pos },
            meta: { node_type: 'position' },
            children: []
          }

          chartNode.label = setNodeName(chartNode)
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
          return splitted[0]
        }

        const name = splitted.map((text, i) => i > 0 ? text : '').join(' ')
        return name
      }

      if (node.meta.node_type === 'position') {
        const position = node.data as PositionInterface
        const splitted = position.positionName.split(' ')

        if (splitted.length === 1) {
          return splitted[0]
        }

        const name = splitted.map((text: string, i: number) => i > 0 ? text : '').join(' ')
        return name
      }

      return ''
    }

    const exportChart = async () => {
      const contenido = document.getElementById('contenido')

      if (!contenido) {
        return
      }

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
    }

    const expandAll = () => {
      for (let node of nodes.value) {
        expandNode(node);
      }

      expandedKeys.value = { ...expandedKeys.value };
    };

    const collapseAll = () => {
      expandedKeys.value = {};
    };

    const initialExpand = (node) => {
      nodes.value.forEach((node, index) => {
        if (index === 0) {
          expandedKeys.value[node.key] = true;

          node.children.forEach((dirNode, dirIndex) => {
            expandedKeys.value[dirNode.key] = true;
          })
        }
      })
    }

    const expandNode = (node) => {
      if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.children) {
            expandNode(child);
        }
      }
    };

    return {
      data,
      search,
      currentPage,
      rowsPerPage,
      nodes,
      expandedKeys,
      setNodeName,
      onNodeDblClick,
      exportChart,
      expandAll,
      collapseAll
    }
  }
})
