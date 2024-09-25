import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeesMonitorPosition',
  props: {
  },
  data: () => ({
    generalData: {
      chart: {
        type: 'organization',
        height: 400
      },
      title: {
        text: 'Organigrama de Empresa'
    },
    series: [{
        type: 'organization',
        name: 'Organización',
        keys: ['from', 'to'],
        data: [
            ['CEO', 'CFO'],
            ['CEO', 'CTO'],
            ['CEO', 'HR'],
            ['CFO', 'Accountant'],
            ['CTO', 'Dev Team Lead'],
            ['CTO', 'QA Lead'],
            ['HR', 'HR Assistant']
        ],
        nodes: [{
            id: 'CEO',
            title: 'Director General',
            name: 'Ana López'
        }, {
            id: 'CFO',
            title: 'Directora Financiera',
            name: 'Beatriz García'
        }, {
            id: 'CTO',
            title: 'Director Técnico',
            name: 'Carlos Ruiz'
        }, {
            id: 'HR',
            title: 'Recursos Humanos',
            name: 'Diana Fernández'
        }, {
            id: 'Accountant',
            title: 'Contable',
            name: 'Elena Martinez'
        }, {
            id: 'Dev Team Lead',
            title: 'Líder de Desarrollo',
            name: 'Francisco Ortega'
        }, {
            id: 'QA Lead',
            title: 'Líder de QA',
            name: 'Gabriel Salinas'
        }, {
            id: 'HR Assistant',
            title: 'Asistente de RRHH',
            name: 'Inés Gómez'
        }],
        colorByPoint: false,
        color: '#007ad0',
        dataLabels: {
            color: 'white'
        },
        borderColor: 'white',
        nodeWidth: 65
    }],
    tooltip: {
        outside: true
    },
    exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
    }
    },
  }),
  methods: {
    generateRandomOrgChartData() {
      // Nombres ficticios de empleados y posiciones
      const employees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George'];
      const positions = ['CEO', 'CTO', 'Manager', 'Engineer', 'Analyst'];

      const randomData: Object[] = [];

      // Crear nodos raíz y empleados
      employees.forEach((employee, index) => {
        const employeeData = {
          name: employee,
          id: `${employee}_${index}`,
          title: positions[Math.floor(Math.random() * positions.length)],
        };
        randomData.push(employeeData);
      });

      // Actualizar la serie con los datos generados
    //   this.generalData.series[0].data = randomData;
    },
  },
  mounted() {
    // Llamar a la función para generar datos aleatorios al montar el componente
    this.generateRandomOrgChartData();
  },
});