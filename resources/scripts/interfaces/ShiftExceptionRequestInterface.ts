import type { DateTime } from "luxon";
import type { ExceptionTypeInterface } from "./ExceptionTypeInterface";

export interface ShiftExceptionRequestInterface {
  id: number;                        
  employeeId: number;               
  departmentId: number;              
  positionId: number;                
  status: string;                   
  employeeName: string;              
  exceptionType: string;             
  startDate: string | DateTime | null;  
  endDate: string | DateTime | null;    
  reason: string;                    
  createdAt: string | DateTime | null; 
  updatedAt: string | DateTime | null; 
  deletedAt: string | DateTime | null; 
  exceptionTypeDetails?: ExceptionTypeInterface;
  exceptionRequestId: number;
}
