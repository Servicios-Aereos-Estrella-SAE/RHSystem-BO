<template>
  <div class='department-chart'>
    <Toast />
    <Head>
      <Title>Organization Chart</Title>
    </Head>
    <NuxtLayout name='backoffice'>
      <div class='pilot-wrapper'>
        <div class='box head-page'>
          <div class='departments-chart-page'>
            <h3>Organization Chart</h3>
            <div class='box'>

              <OrganizationChart :value='data' collapsible>
              <template #person='slotProps'>
                <div>
                  <div>
                    <span>
                      {{ slotProps.node.data.name }}
                    </span>
                  </div>
                  <div class='department-positions'>
                    <div v-if='slotProps.node.data'>
                      <p v-for='(position, index) in slotProps.node.data.positions' :key='index' class='position-name'>
                        - {{ position.position.positionName }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </OrganizationChart>
            </div>
          </div>
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
  const departmentMap = {}
  let keyCounter = 0 

  departments.forEach(dept => {
    departmentMap[dept.departmentId] = {
      key: keyCounter.toString(),
      type: 'person',
      styleClass: getDepartmentStyle(dept),
      data: {
        name: dept.departmentName,
        positions: dept.departmentsPositions
      },
      children: []
    }

    keyCounter++ 
  })

  departments.forEach(dept => {
    if (dept.parentDepartmentId) {
      const parentKey = departmentMap[dept.parentDepartmentId].key 
      const childCount = departmentMap[dept.parentDepartmentId].children.length 
      const childKey = `${parentKey}_${childCount}` 

      departmentMap[dept.departmentId].key = childKey

      departmentMap[dept.parentDepartmentId].children.push(departmentMap[dept.departmentId])
    }
  })


  const cleanedDepartments = Object.values(departmentMap).filter(dept => !dept.parentDepartmentId)

  return cleanedDepartments
}

const getDepartmentStyle = (node) => {
  const styles = {
    'Dirección General': 'ceo',
  }
  return styles[node.departmentName] || ''
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

onMounted(fetchData)
</script>

<style lang='scss'>
.p-organizationchart-node-content {
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;

  // &.ceo {
  //   background-color: #33D4AD;
  //   color: white;
  // }

  // &:has(.level-2) {
  //   background-color: #3CB4E5;
  //   color: white;
  // }

  // &:has(.level-3) {
  //   background-color: #88a4bf;
  //   color: white;
  // }
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

/* .bg-indigo-100 {
  background-color: #6f8ce0 !important;
  padding: 20px;
}

.bg-purple-100 {
  background-color: #9a67b3 !important;
  padding: 20px;
}

.bg-teal-100 {
  background-color: #66b2a8 !important;
  padding: 20px;
}

.bg-pink-100 {
  background-color: #f78da7 !important;
  padding: 20px;
}

.bg-gray-100 {
  background-color: #c4c4c4 !important;
  padding: 20px;
}
.position-name{
  text-align: left;
} */
</style>
