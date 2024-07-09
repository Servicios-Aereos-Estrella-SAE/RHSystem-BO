<template>
    <div>
      <h1>Departamentos</h1>
      <div v-for="department in departments" :key="department.id" class="department-card">
        <h2>{{ department.name }}</h2>
        <p>{{ department.description }}</p>
        <button @click="viewDepartment(department.id)">Ver Detalles</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        departments: []
      };
    },
    mounted() {
      this.fetchDepartments();
    },
    methods: {
      fetchDepartments() {
        fetch('/api/departments')
          .then(response => response.json())
          .then(data => {
            this.departments = data;
          })
          .catch(error => {
            console.error('Error fetching departments:', error);
          });
      },
      viewDepartment(departmentId) {
        // Lógica para ver los detalles de un departamento
        this.$router.push(`/departments/${departmentId}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .department-card {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 16px 0;
  }
  </style>
  