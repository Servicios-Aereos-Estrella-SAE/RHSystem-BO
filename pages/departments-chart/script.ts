import { defineComponent } from 'vue';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeesMonitorPosition',
  data: () => ({
    generalData: {
      chart: {
        type: 'treegraph',
        height: 400
      },
      title: {
        text: 'Organigrama de Empresa'
      },
      series: [{
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
    }
  }),
  // No es necesario el método `generateRandomOrgChartData` si no se va a usar
});
