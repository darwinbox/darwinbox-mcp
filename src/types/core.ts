export interface EmployeeDetails {
  employee_ids?: string[];
  last_modified?: string;
}

export interface EmployeeUpdate {
  employee_data: any;
}

export interface EmployeeHistory {
  from: string;
  to: string;
  filter_on_effective_date: number;
}

export interface PersonalDocs {
  employee_no: string;
  for: string;
}

export interface PositionMaster {
  status: number;
  need_to_hire: number;
  employee_nos: string[];
}

export interface FormsData {
  form_id: string;
  type: string;
  form_type: string;
  from: string;
  to: string;
}

export interface SeparationDetails {
  separation_status: string;
  employee_ids: string[];
}

export interface AddEmployee {
  employees: {
    [key: string]: any;
  };
}

export interface DeactivateEmployee {
  employees: Array<{
    employee_id: string;
    deactivate_type: string;
    deactivate_reason: string;
    date_of_resignation: string;
    date_of_exit: string;
  }>;
}

export interface ProfileAttachment {
  employee_no: string;
  section: string;
  section_attribute: string;
  attachment: string;
}
