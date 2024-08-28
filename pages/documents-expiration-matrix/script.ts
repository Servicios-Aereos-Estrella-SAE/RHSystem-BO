export default defineComponent({
    name: 'DocumentsExpirationMatrix',
    props: {},
    data: () => ({
        // carousel settings
        settings: {
            itemsToShow: 3,
            snapAlign: 'start',
        },
        tabActive: 'aircraft' as 'pilots' | 'aircraft' | 'customers' | 'employees',
        // breakpoints are mobile first
        // any settings not specified will fallback to the carousel settings
        breakpoints: {
            // 700px and up
            300: {
                itemsToShow: 1,
                snapAlign: 'start',
            },
            500: {
              itemsToShow: 2,
              snapAlign: 'start',
            },
            700:{
              itemsToShow: 2.4,
              snapAlign: 'start',
            },
            // 1024 and up
            1024: {
                itemsToShow: 3,
                snapAlign: 'start',
            },
            2084: {
                itemsToShow: 6,
                snapAlign: 'start',
            },
        },
        pilots: {
            expiredDocumentsCount: 2,
            upcomingExpiredDocumentsCount: 3,
            activeDocumentsCount: 5,
            activeDocumentsPercentage: 50, // Esto es un ejemplo calculado
            documents: [
            {
                proceeding_file_id: 1,
                proceeding_file_name: "Pilot License",
                proceeding_file_path: "/files/pilot_license.pdf",
                proceeding_file_expiration_at: "2024-07-23",
                proceeding_file_active: 1,
                proceeding_file_identify: "PL-123",
                proceeding_file_uuid: "uuid-123",
                proceeding_file_type_name: "License",
                pilot_name: "John Doe", // Ejemplo de nombre de piloto
            },
            {
                proceeding_file_id: 2,
                proceeding_file_name: "Medical Certificate",
                proceeding_file_path: "/files/medical_certificate.pdf",
                proceeding_file_expiration_at: "2024-09-15",
                proceeding_file_active: 1,
                proceeding_file_identify: "MC-456",
                proceeding_file_uuid: "uuid-456",
                proceeding_file_type_name: "Certificate",
                pilot_name: "John Doe", // Ejemplo de nombre de piloto
              },
              {
                proceeding_file_id: 3,
                proceeding_file_name: "Medical Certificate",
                proceeding_file_path: "/files/medical_certificate.pdf",
                proceeding_file_expiration_at: "2024-07-15",
                proceeding_file_active: 1,
                proceeding_file_identify: "MC-789",
                proceeding_file_uuid: "uuid-789",
                proceeding_file_type_name: "Certificate",
                pilot_name: "John Doe", // Ejemplo de nombre de piloto
              },
              {
                proceeding_file_id: 4,
                proceeding_file_name: "Medical Certificate",
                proceeding_file_path: "/files/medical_certificate.pdf",
                proceeding_file_expiration_at: "2024-09-16",
                proceeding_file_active: 1,
                proceeding_file_identify: "MC-101",
                proceeding_file_uuid: "uuid-101",
                proceeding_file_type_name: "Certificate",
                pilot_name: "John Doe", // Ejemplo de nombre de piloto
              },
              {
                proceeding_file_id: 5,
                proceeding_file_name: "Medical Certificate",
                proceeding_file_path: "/files/medical_certificate.pdf",
                proceeding_file_expiration_at: "2024-09-17",
                proceeding_file_active: 1,
                proceeding_file_identify: "MC-112",
                proceeding_file_uuid: "uuid-112",
                proceeding_file_type_name: "Certificate",
                pilot_name: "John Doe", // Ejemplo de nombre de piloto
              },
              // Más documentos...
            ],
          },
          aircraft: {
            expiredDocumentsCount: 1,
            upcomingExpiredDocumentsCount: 2,
            activeDocumentsCount: 7,
            activeDocumentsPercentage: 70,
            documents: [
              {
                proceeding_file_id: 3,
                proceeding_file_name: "International flight license",
                proceeding_file_path: "/files/airworthiness_certificate.pdf",
                proceeding_file_expiration_at: "2024-08-20",
                proceeding_file_active: 1,
                proceeding_file_identify: "AC-789",
                proceeding_file_uuid: "uuid-789",
                proceeding_file_type_name: "Flight License",
                tail_number: "N12345",
                model: "Larget",
              },
              {
                proceeding_file_id: 4,
                proceeding_file_name: "International flight license",
                proceeding_file_path: "/files/maintenance_logbook.pdf",
                proceeding_file_expiration_at: "2024-09-15",
                proceeding_file_active: 1,
                proceeding_file_identify: "ML-456",
                proceeding_file_uuid: "uuid-456",
                proceeding_file_type_name: "Flight License",
                tail_number: "N54321",
                model: "Gulfstream G650",
              },
              {
                proceeding_file_id: 5,
                proceeding_file_name: "International flight license",
                proceeding_file_path: "/files/registration_certificate.pdf",
                proceeding_file_expiration_at: "2024-09-10",
                proceeding_file_active: 1,
                proceeding_file_identify: "RC-321",
                proceeding_file_uuid: "uuid-321",
                proceeding_file_type_name: "Flight License",
                tail_number: "N98765",
                model: "Cessna Citation X",
              },
              // Más documentos...
            ],
          },
          customers: {
            expiredDocumentsCount: 0,
            upcomingExpiredDocumentsCount: 0,
            activeDocumentsCount: 9,
            activeDocumentsPercentage: 100,
            documents: [
          //     {
          //       proceeding_file_id: 5,
          //       proceeding_file_name: "Employment Contract",
          //       proceeding_file_path: "/files/employment_contract.pdf",
          //       proceeding_file_expiration_at: "2024-08-10",
          //       proceeding_file_active: 1,
          //       proceeding_file_identify: "EC-654",
          //       proceeding_file_uuid: "uuid-102",
          //       proceeding_file_type_name: "Contract",
          //       customer_name: "Jane Smith",
          //   },
          //   {
          //       proceeding_file_id: 6,
          //       proceeding_file_name: "Confidentiality Agreement",
          //       proceeding_file_path: "/files/confidentiality_agreement.pdf",
          //       proceeding_file_expiration_at: "2024-09-30",
          //       proceeding_file_active: 1,
          //       proceeding_file_identify: "CA-321",
          //       proceeding_file_uuid: "uuid-103",
          //       proceeding_file_type_name: "Agreement",
          //       customer_name: "Rogelio Rafael",
          //   },
          //   {
          //       proceeding_file_id: 7,
          //       proceeding_file_name: "Non-Compete Agreement",
          //       proceeding_file_path: "/files/non_compete_agreement.pdf",
          //       proceeding_file_expiration_at: "2024-09-25",
          //       proceeding_file_active: 1,
          //       proceeding_file_identify: "NCA-987",
          //       proceeding_file_uuid: "uuid-104",
          //       proceeding_file_type_name: "Agreement",
          //       customer_name: "Wilvardo Ramirez",
          //   },
          //   {
          //     proceeding_file_id: 7,
          //     proceeding_file_name: "Non-Compete Agreement",
          //     proceeding_file_path: "/files/non_compete_agreement.pdf",
          //     proceeding_file_expiration_at: "2024-09-25",
          //     proceeding_file_active: 1,
          //     proceeding_file_identify: "NCA-987",
          //     proceeding_file_uuid: "uuid-104",
          //     proceeding_file_type_name: "Agreement",
          //     customer_name: "Wilvardo Ramirez",
          // },
            ],
          },
          employees: {
            expiredDocumentsCount: 3,
            upcomingExpiredDocumentsCount: 1,
            activeDocumentsCount: 4,
            activeDocumentsPercentage: 50,
            documents: [
            {
                proceeding_file_id: 5,
                proceeding_file_name: "Employment Contract",
                proceeding_file_path: "/files/employment_contract.pdf",
                proceeding_file_expiration_at: "2024-08-10",
                proceeding_file_active: 1,
                proceeding_file_identify: "EC-654",
                proceeding_file_uuid: "uuid-102",
                proceeding_file_type_name: "Contract",
                employee_name: "Jane Smith",
            },
            {
                proceeding_file_id: 6,
                proceeding_file_name: "Confidentiality Agreement",
                proceeding_file_path: "/files/confidentiality_agreement.pdf",
                proceeding_file_expiration_at: "2024-09-30",
                proceeding_file_active: 1,
                proceeding_file_identify: "CA-321",
                proceeding_file_uuid: "uuid-103",
                proceeding_file_type_name: "Agreement",
                employee_name: "Rogelio Rafael",
            },
            {
                proceeding_file_id: 7,
                proceeding_file_name: "Non-Compete Agreement",
                proceeding_file_path: "/files/non_compete_agreement.pdf",
                proceeding_file_expiration_at: "2024-09-25",
                proceeding_file_active: 1,
                proceeding_file_identify: "NCA-987",
                proceeding_file_uuid: "uuid-104",
                proceeding_file_type_name: "Agreement",
                employee_name: "Wilvardo Ramirez",
            },
            {
                proceeding_file_id: 8,
                proceeding_file_name: "Safety Training Certificate",
                proceeding_file_path: "/files/safety_training_certificate.pdf",
                proceeding_file_expiration_at: "2024-09-15",
                proceeding_file_active: 1,
                proceeding_file_identify: "STC-876",
                proceeding_file_uuid: "uuid-105",
                proceeding_file_type_name: "Certificate",
                employee_name: "Jose Guadalupe",
            },
            ],
        },
    }),
    computed: {
        documentsSelected() {
            let documents = this[this.tabActive].documents;
            return documents;
        }
    },
    created () {},
    mounted() {
    },
    methods: {
      setActive(activeTab: 'pilots' | 'aircraft' | 'customers' | 'employees') {
        this.tabActive = activeTab;
      }
    }
})
