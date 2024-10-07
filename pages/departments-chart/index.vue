<template>
  <div class="department-chart">
    <Toast />
    

      <Head>
        <Title>Organization Chart</Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="pilot-wrapper">
          <div class="box head-page">
            <div class="departments-chart-page">
              <h3>Organization Chart</h3>
              <div class="box">

                <OrganizationChart :value="data" collapsible>
                <!-- Personalización de cada nodo del organigrama -->
                <template #person="slotProps">
                  <div :class="['flex flex-col', getNodeClass(slotProps.node)]">
                    <!-- Nombre del departamento -->
                    <div class="flex flex-col items-center">
                      <span class="font-bold mb-2">{{ slotProps.node.data.name }} - </span>
                      <span>{{ slotProps.node.data.title || 'No Alias' }}</span>
                    </div>
                    <!-- Listado de posiciones dentro del departamento -->
                    <div class="flex flex-col items-center mt-2">
                      <h4 class="font-bold">Positions: </h4>
                      <div v-if="slotProps.node.data">
                      <!-- Filtrar posiciones duplicadas -->
                      <p v-for="(position, index) in getUniquePositions(slotProps.node.data.positions)" :key="index" class="position-name">
                        - {{ position.position.positionName }} <!-- Acceder a positionName dentro de employee.position -->
                      </p>
                    </div>
                    <span v-else>No positions available</span>
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
import { ref, onMounted } from 'vue';
import Toast from 'primevue/toast';
import OrganizationChart from 'primevue/organizationchart';
import ToastService from 'primevue/toastservice';
import DepartmentService from "~/resources/scripts/services/DepartmentService";

const data = ref([]);

const search = ref('');
const currentPage = ref(1);
const rowsPerPage = ref(10);

const fetchData = async () => {
  try {
    const response = await new DepartmentService().getSearchOrganization(search.value, currentPage.value, rowsPerPage.value);
    const departments = response._data.data.departments;     
    const mappedData = mapDepartments(departments);
    if (mappedData.length > 0) {
      data.value = mappedData[0];
    }

  } catch (error) {
    console.error("Error fetching department data", error);
  }
};

const mapDepartments = (departments) => {
  const departmentMap = {};
  let keyCounter = 0; 

  departments.forEach(dept => {
    departmentMap[dept.departmentId] = {
      key: keyCounter.toString(),
      type: 'person',
      styleClass: getDepartmentStyle(dept.departmentName),
      data: {
        name: dept.departmentName,
        title: dept.departmentAlias,
        positions: dept.employees
      },
      children: []
    };
    keyCounter++; 
  });

  departments.forEach(dept => {
    if (dept.parentDepartmentId) {
      const parentKey = departmentMap[dept.parentDepartmentId].key; 
      const childCount = departmentMap[dept.parentDepartmentId].children.length; 
      const childKey = `${parentKey}_${childCount}`; 

      departmentMap[dept.departmentId].key = childKey;

      departmentMap[dept.parentDepartmentId].children.push(departmentMap[dept.departmentId]);
    }
  });

  const cleanedDepartments = Object.values(departmentMap).filter(dept => !dept.parentDepartmentId);

  return cleanedDepartments;
};

const getDepartmentStyle = (name) => {
  const styles = {
    "AA": "!bg-indigo-100 text-white rounded-xl",
    "Administración": "bg-purple-100 text-white rounded-xl",
    "CTO": "bg-teal-100 text-white rounded-xl",
    "HR": "bg-pink-100 text-white rounded-xl",
  };
  return styles[name] || "bg-gray-100 text-white rounded-xl"; // Estilo por defecto
};
const getUniquePositions = (positions) => {
  const seen = new Set();
  return positions.filter((position) => {
    const isDuplicate = seen.has(position.position.positionName);
    seen.add(position.position.positionName);
    return !isDuplicate;
  });
};

const getNodeClass = (node) => {
  const role = node.data.name;
  console.log(role)
  if (role === 'AA') {
    return 'bg-purple-100';
  } else if (role === 'CFO') {
    return 'bg-purple-100';
  } else if (role === 'CTO') {
    return 'bg-teal-100';
  } else if (role === 'HR') {
    return 'bg-pink-100';
  }
  return 'bg-teal-100'; // Clase por defecto
};

onMounted(fetchData);
</script>

<style scoped>
.chart-page {
  padding: 20px;
}


.bg-indigo-100 {
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
}
</style>
