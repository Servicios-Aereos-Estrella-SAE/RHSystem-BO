<template>
  <div>
    <Toast />
    <Head>
      <Title>Organization Chart</Title>
    </Head>
    <NuxtLayout name='backoffice'>
      <div class='departments-chart-page'>
        <div class='box head-page'>
          <div>
            <h3>
              Organization Chart
            </h3>
          </div>
        </div>
        <div class='box chart-wrapper'>
          <OrganizationChart :value='data' collapsible>
            <template #organization='slotProps'>
              <div class="node-card" @dblclick="onNodeSelect(slotProps.node.data)">
                <div>
                  <span>
                    {{ setNodeName(slotProps.node.data.departmentName) }}
                  </span>
                </div>
              </div>
            </template>
            <!-- <template #positions='slotProps'>
              <div>
                <div>
                  <span>
                    {{ slotProps.node.data.positionName }}
                  </span>
                </div>
              </div>
            </template> -->
          </OrganizationChart>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Toast from 'primevue/toast'
import OrganizationChart from 'primevue/organizationchart'
import DepartmentService from '~/resources/scripts/services/DepartmentService'

// interface chartNode {
//   key: string
//   type: string
//   label: string
//   styleClass: string
//   data: any
//   children: chartNode[]
// }

const data = ref([])

const search = ref('')
const currentPage = ref(1)
const rowsPerPage = ref(9999)

const fetchData = async () => {
  try {
    const response = await new DepartmentService().getSearchOrganization(search.value, currentPage.value, rowsPerPage.value)
    const departments = response._data.data.departments
    const mappedData = mapDepartments(departments)

    if (mappedData.length > 0) {
      data.value = mappedData[0]
    }
  } catch (error) {
    console.error('Error fetching department data', error)
  }
}

const mapDepartments = (departments) => {
  const departmentList = JSON.parse(JSON.stringify(departments))

  for (let index = 0; index < departmentList.length; index++) {
    const department = departmentList[index];
    departmentList[index] = makeNodeFormat(department)
  }

  return departmentList
}

const makeNodeFormat = (department) => {
  const nodeSkull = {
    key: Math.round(Math.random() * new Date().getTime()),
    type: 'organization',
    styleClass: getDepartmentStyle(department),
    data: { ...department },
    children: department.subDepartments.map(sub => makeNodeFormat(sub))
  }

  // if (department.departmentsPositions) {
  //   const pos = department.departmentsPositions.map(position => makeNodeFormatPosition(position.position))
  //   nodeSkull.children.push(...pos)
  // }

  return nodeSkull
}

const makeNodeFormatPosition = (position) => {
  const nodeSkull = {
    key: Math.round(Math.random() * new Date().getTime()),
    type: 'positions',
    styleClass: getPositionStyle(position),
    data: { ...position },
    children: (position && position.subPositions) ? position.subPositions.map(sub => makeNodeFormatPosition(sub)) : []
  }

  return nodeSkull
}

const getDepartmentStyle = (node) => {
  const styles = {
    'Dirección General': 'ceo',
  }

  return styles[node.departmentName] || 'department'
}

const getPositionStyle = (node) => {
  return (node && node.parentPositionId) ? node.parentPositionId ? 'subposition' : 'position' : 'subposition'
}

const getUniquePositions = (positions) => {
  const seen = new Set()
  return positions.filter((position) => {
    const isDuplicate = seen.has(position.position.positionName)
    seen.add(position.position.positionName)
    return !isDuplicate
  })
}

const getNodeClass = (node) => {
  // const nodeLevel = `${node.key}`.split('_').length
  // return `level-${nodeLevel}`
}

const onNodeSelect = (node) => {
  console.log('🚀 ----------------------------🚀')
  console.log('🚀 ~ onNodeSelect ~ node:', node.departmentName)
  console.log('🚀 ----------------------------🚀')
}

const setNodeName = (name) => {
  const splitted = name.split('*')
  const newName = splitted[splitted.length - 1]
  return newName
}

onMounted(async () => {
  await fetchData()
})
</script>

<style lang='scss'>
.departments-chart-page {

  .chart-wrapper {
    width: calc(var(--screen-width) - 2rem) !important;
    min-height: 70dvh;
    overflow: auto;
  }
}

.p-organizationchart-node-content {
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  // width: 10rem;
  // height: 4rem;
  // align-content: center;

  &.ceo {
    background-color: #3787d8;
    color: #ffffff;
  }

  &.department {
    background-color: #54789c;
    color: #fff;
  }

  &.position {
    background-color: #f1f5f9;
    color: #88a4bf;
  }

  &.subposition {
    background-color: #f1f5f9;
    color: #88a4bf;
  }
}


.department-positions {

  .position-name {
    text-align: left;
    font-weight: normal;
    font-size: 0.65rem;
  }
}

.p-organizationchart-table > tbody > tr > td {
  padding: 0 0.15rem;
}

.node-card {
  cursor: pointer;
}
</style>
