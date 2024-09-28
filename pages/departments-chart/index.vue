<template>
    <div>
      <Toast />
      <div class="chart-page">
        <Head>
          <Title>Organigrama de Empresa</Title>
        </Head>
        <NuxtLayout name="backoffice">
          <div class="pilot-wrapper">
            <div class="box head-page">
              <div class="departments-chart-page">
                <h3>Organigrama de Empresa</h3>
                <div class="box">
                  <OrganizationChart :value="data" collapsible>
                    <template #person="slotProps">
                      <div class="flex flex-col">
                        <div class="flex flex-col items-center">
                          <img :alt="slotProps.node.data.name" :src="slotProps.node.data.image" class="mb-4 w-12 h-12" />
                          <span class="font-bold mb-2">{{ slotProps.node.data.name }}</span>
                          <span>{{ slotProps.node.data.title }}</span>
                        </div>
                      </div>
                    </template>
                    <template #default="slotProps">
                      <span>{{ slotProps.node.label }}</span>
                    </template>
                  </OrganizationChart>
                </div>
              </div>
            </div>
          </div>
        </NuxtLayout>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Toast from 'primevue/toast';
  import OrganizationChart from 'primevue/organizationchart'; // Importa el componente
  import ToastService from 'primevue/toastservice';
  
  const data = ref({
    key: '0',
    type: 'person',
    styleClass: 'bg-indigo-100 text-white rounded-xl', // Estilo del CEO
    data: {

      title: 'CEO'
    },
    children: [
      {
        key: '0_0',
        type: 'person',
        styleClass: 'bg-purple-100 text-white rounded-xl', // Estilo del CFO
        data: {
          title: 'CFO'
        },
        children: [
          {
            label: 'Contable',
            styleClass: 'bg-purple-200 text-white rounded-xl' // Estilo para Contable
          },
          {
            label: 'Finanzas',
            styleClass: 'bg-purple-300 text-white rounded-xl' // Estilo para Finanzas
          }
        ]
      },
      {
        key: '0_1',
        type: 'person',
        styleClass: 'bg-teal-100 text-white rounded-xl', // Estilo del CTO
        data: {
          title: 'Carlos Ruiz - CTO'
        },
        children: [
          {
            label: 'Desarrollo',
            styleClass: 'bg-teal-200 text-white rounded-xl' // Estilo para Desarrollo
          },
          {
            label: 'QA',
            styleClass: 'bg-teal-300 text-white rounded-xl' // Estilo para QA
          }
        ]
      },
      {
        key: '0_2',
        type: 'person',
        styleClass: 'bg-pink-100 text-white rounded-xl', // Estilo para HR
        data: {
    
          title: 'HR'
        },
        children: [
          {
            label: 'Asistente',
            styleClass: 'bg-pink-200 text-white rounded-xl' // Estilo para Asistente
          }
        ]
      }
    ]
  });
  </script>
  
  <style scoped>
  .chart-page {
    padding: 20px;
  }
  
  .p-organizationchart .p-node img {
    width: 50px; /* Ajusta el ancho según sea necesario */
    height: 50px; /* Ajusta la altura según sea necesario */
    object-fit: cover; /* Mantiene la relación de aspecto de la imagen */
    border-radius: 50%; /* Hace las imágenes redondas */
  }
  
  /* Estilos personalizados para los nodos */
  .bg-indigo-100 {
    background-color: #6f8ce0 !important; /* Cambia el color de fondo */
  }
  
  .bg-purple-100 {
    background-color: #9a67b3 !important; /* Cambia el color de fondo */
  }
  
  .bg-teal-100 {
    background-color: #66b2a8 !important; /* Cambia el color de fondo */
  }
  
  .bg-pink-100 {
    background-color: #f78da7 !important; /* Cambia el color de fondo */
  }
  
  /* Más variaciones para los hijos */
  .bg-purple-200 {
    background-color: #a16cb8 !important; /* Cambia el color de fondo para Contable */
  }
  
  .bg-purple-300 {
    background-color: #b688c6 !important; /* Cambia el color de fondo para Finanzas */
  }
  
  .bg-teal-200 {
    background-color: #79c4b6 !important; /* Cambia el color de fondo para Desarrollo */
  }
  
  .bg-teal-300 {
    background-color: #8fd8d2 !important; /* Cambia el color de fondo para QA */
  }
  
  .bg-pink-200 {
    background-color: #f79baf !important; /* Cambia el color de fondo para Asistente */
  }
  </style>
  