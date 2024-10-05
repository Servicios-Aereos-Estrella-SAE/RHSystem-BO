import { ref, onMounted } from 'vue';
import Toast from 'primevue/toast';
import OrganizationChart from 'primevue/organizationchart';
import ToastService from 'primevue/toastservice';
import DepartmentService from "~/resources/scripts/services/DepartmentService";

// Variables reactivas
interface DepartmentNode {
  key: string;
  type: string;
  styleClass: string;
  data: {
    name: string;
    title: string;
  };
  children: DepartmentNode[];
}
const data = ref(); 
const search = ref('');
const currentPage = ref(1);
const rowsPerPage = ref(10);

// Función para obtener datos
const fetchData = async () => {
  try {
    const response = await new DepartmentService().getSearchDepartmentList(search.value, currentPage.value, rowsPerPage.value);
    const departments = response._data.data.data;
    const mappedData = mapDepartments(departments);
    
    // Asignar el nodo raíz si existe, o null si no hay datos
    data.value = mappedData.length > 0 ? mappedData[0] : null;

  } catch (error) {
    console.error("Error fetching department data", error);
  }
};

// Mapeo de departamentos a la estructura del organigrama
const mapDepartments = (departments: any[]) => {
  const departmentMap: any = {};
  let keyCounter = 0;

  // Crear el mapa de departamentos
  departments.forEach(dept => {
    departmentMap[dept.departmentId] = {
      key: keyCounter.toString(),
      type: 'person',
      styleClass: getDepartmentStyle(dept.departmentName),
      data: {
        name: dept.departmentName,
        title: dept.departmentAlias || 'No Alias', // Aquí se asigna 'No Alias' si el título es null o undefined
      },
      children: []
    };
    keyCounter++;
  });

  // Relacionar los departamentos padres e hijos
  departments.forEach(dept => {
    if (dept.parentDepartmentId) {
      const parentKey = departmentMap[dept.parentDepartmentId].key;
      const childCount = departmentMap[dept.parentDepartmentId].children.length;
      const childKey = `${parentKey}_${childCount}`; 

      departmentMap[dept.departmentId].key = childKey;
      departmentMap[dept.parentDepartmentId].children.push(departmentMap[dept.departmentId]);
    }
  });

  // Filtrar solo los departamentos raíz (que no tienen padre)
  return Object.values(departmentMap).filter((dept: any) => !dept.parentDepartmentId);
};

// Obtener el estilo de clase según el nombre del departamento
const getDepartmentStyle = (name: string) => {
  const styles: Record<string, string> = {
    "AA": "!bg-indigo-100 text-white rounded-xl",
    "Administración": "bg-purple-100 text-white rounded-xl",
    "CTO": "bg-teal-100 text-white rounded-xl",
    "HR": "bg-pink-100 text-white rounded-xl",
  };
  return styles[name] || "bg-gray-100 text-white rounded-xl"; // Estilo por defecto
};

// Obtener la clase del nodo según el rol
const getNodeClass = (node: any) => {
  const role = node.data.name;
  
  if (role === 'AA' || role === 'CFO') {
    return 'bg-purple-100';
  } else if (role === 'CTO') {
    return 'bg-teal-100';
  } else if (role === 'HR') {
    return 'bg-pink-100';
  }
  
  return 'bg-teal-100'; // Clase por defecto
};

// Montar el componente y cargar los datos
onMounted(fetchData);

// Exportar para uso en el componente principal
export default {
  components: {
    Toast,
    OrganizationChart,
    ToastService
  },
  setup() {
    return {
      data,
      search,
      currentPage,
      rowsPerPage,
      getNodeClass,
    };
  },
};

