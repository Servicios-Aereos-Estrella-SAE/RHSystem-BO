interface EmployeeImportExcelResponseInterface {
  type: string;
  title: string;
  message: string;
  data: {
    totalRows: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    limitReached: boolean;
    errors: string[];
  };
}

export type { EmployeeImportExcelResponseInterface };
