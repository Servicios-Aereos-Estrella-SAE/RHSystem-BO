import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { PositionInterface } from "~/resources/scripts/interfaces/PositionInterface"; // Importa la interfaz para la posición
import DepartmentService from "~/resources/scripts/services/DepartmentService";
// import CompanyService from '~/resources/scripts/services/CompanyService'; // Servicio para obtener las empresas
import PositionService from "~/resources/scripts/services/PositionService"; // Servicio para manejar posiciones

export default defineComponent({
  name: "PositionInfoForm",
  props: {
    position: { type: Object as PropType<PositionInterface>, required: true }, // Propiedad para manejar la información de la posición
    clickOnSave: { type: Function, default: null },
    onSaveNewPosition: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    companyOptions: [],
    parentPositions: [],
    positions: [] as PositionInterface[],
  }),
  computed: {
    isPositionActive: {
      get() {
        return this.position.positionActive === 1;
      },
      set(newValue: boolean) {
        this.position.positionActive = newValue ? 1 : 0;
      },
    },
  },
  mounted() {
    // this.loadCompanyOptions(); // Carga las opciones del dropdown de empresas al montar el componente
    this.loadParentPositions();
  },
  methods: {
    // async loadCompanyOptions() {
    //   try {
    //     const companyService = new CompanyService();
    //     const response = await companyService.getFilteredList(''); // Obtiene la lista de empresas
    //     if (response.status === 200) {
    //       this.companyOptions = response._data.data.data.map((company: any) => ({
    //         name: company.companyName,
    //         id: company.companyId,
    //       }));
    //     } else {
    //       this.$toast.add({
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: 'Error loading company options.',
    //         life: 5000
    //       });
    //     }
    //   } catch (error) {
    //     this.$toast.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Error loading company options.',
    //       life: 5000
    //     });
    //   }
    // },
    async loadParentPositions() {
      try {
        const positionService = new PositionService();
        const departmentId = this.position.departmentId;

        const response = await positionService.getPositionsDepartment(
          departmentId
        );
        if (response) {
          this.positions = response.map((position: any) => ({
            positionId: position.positionId,
            positionSyncId: position.positionSyncId,
            positionCode: position.positionCode,
            positionName: position.positionName,
            positionAlias: position.positionAlias,
            positionIsDefault: position.positionIsDefault,
            positionActive: position.positionActive,
            parentPositionId: position.parentPositionId,
            parentPositionSyncId: position.parentPositionSyncId,
            companyId: position.companyId,
            departmentId: position.departmentId,
            positionLastSynchronizationAt:
              position.positionLastSynchronizationAt,
            positionCreatedAt: position.positionCreatedAt,
            positionUpdatedAt: position.positionUpdatedAt,
            positionDeletedAt: position.positionDeletedAt,
          }));
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error loading parent positions options.",
            life: 5000,
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error loading parent positions options.",
          life: 5000,
        });
      }
    },
    async onSave() {
      this.submitted = true;
      if (
        this.position &&
        this.position.positionCode &&
        this.position.positionName &&
        this.position.positionAlias &&
        this.position.companyId
      ) {
        try {
          const response = this.position.positionId
            ? await this.updatePosition()
            : await this.createPosition();

          if (response.status === 200 || response.status === 201) {
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Position saved successfully",
              life: 5000,
            });
            const position = response._data.data.position.positionId;
            //HERE
            const departmentId = this.position.departmentId;
            console.log(position);
            console.log(departmentId);
            console.log(position);
            const departmentService = new DepartmentService();
            const departmentPositionResponse =
              await departmentService.assignDepartment(position, departmentId);

            this.$emit("onSaveNewPosition", position as PositionInterface); // Emitir evento al guardar la posición
            this.$emit("save-success");
          } else {
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail:
                "There was an error saving the position: " +
                response._data.data.sqlMessage,
              life: 10000,
            });
            this.$emit("save-error");
          }
        } catch (error) {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "There was an error saving the position: " + error,
            life: 5000,
          });
          this.$emit("save-error");
        }
      }
    },
    async createPosition() {
      const positionService = new PositionService();
      return await positionService.store(this.position); // Crear la nueva posición
    },
    async updatePosition() {
      const positionService = new PositionService();
      return await positionService.update(this.position); // Actualizar una posición existente
    },
  },
});
