export interface JobListingParams {
  job_updated_timestamp_from: string;
}

export interface JobLocation {
  name: string;
  city: string;
  country: string;
}

export interface JobListing {
  job_id: string;
  job_code: string;
  group_company: string;
  parent_department: string;
  department: string;
  division: string | null;
  business_unit: string;
  location: string[];
  location_city: string[];
  location_country: string;
  job_title: string;
  post_on_careers_page: number;
  post_on_refer_page: number;
  post_on_ijp_page: number;
  employee_type: string;
  job_created_timestamp: string;
  job_updated_timestamp: string;
  experience_to: string;
  experience_from: string;
  is_remote: number;
}

export interface JobListingResponse {
  status: number;
  message: string;
  data: JobListing[];
}

export interface JobDetailParams {
  job_id: string;
}

export interface HiringTeamMember {
  name: string;
  employee_id: string;
  email_id: string;
}

export interface ApplicantField {
  order: number;
  name: string;
  required: boolean;
  type: string;
  is_custom: boolean;
  options: boolean | string[] | Array<{label: string; value: string}>;
  is_calculation_active: boolean;
  rules: boolean;
  has_dependency: boolean;
  dependent_keys: string[];
  hasDependentDropdown: boolean;
  dependentField: string;
  optionEndpoint: string;
  queryParam: any[];
  validation: {
    regex: string;
    valid_extentions: string;
  };
  isOtherEnabled?: boolean;
  otherSelectValue?: string;
  otherFieldLabel?: string;
}

export interface JobDetail {
  job_title: string;
  group_company: string;
  department_code: string;
  department: string;
  parent_department: string;
  designation_code: string;
  designation: string;
  employee_type: string;
  band: string;
  grade: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  experience_from: string;
  experience_to: string;
  unit_experience: string;
  location: string[];
  location_city: string[];
  location_country: string;
  job_decription: string;
  total_positions: number;
  open_positions: number;
  post_on_careers_page: number;
  post_on_refer_page: number;
  post_on_ijp_page: number;
  job_created_timestamp: string;
  job_updated_timestamp: string;
  job_status: string;
  hiring_lead: HiringTeamMember[];
  screening_team: HiringTeamMember[];
  shortlisting_team: HiringTeamMember[];
  scheduling_team: HiringTeamMember[];
  hiring_group: HiringTeamMember[];
  applicant_fields: {
    [key: string]: ApplicantField;
  };
}

export interface JobDetailResponse {
  status: number;
  message: string;
  data: JobDetail;
}

export interface BulkCandidatesParams {
  updated_from: string;
  updated_to: string;
}

export interface CandidateWorkExperience {
  "Currently working here": string;
}

export interface CandidateReference {
  "Reference Name": string;
  "Reference Email": string;
}

export interface CandidateProfessionalReference {
  "Reference Provider Name": string;
  "Reference Provider Email": string;
}

export interface CandidateApplicationData {
  Biographical: {
    "First Name": string;
    "Last Name": string;
    "Sub Community Details": string;
    "Phonepe test": string;
    "employee typee": string;
  };
  Contact: {
    "Personal Email ID": string;
    "Country Code Personal": string;
    "Personal mobile no": string;
  };
  "Work Experience": CandidateWorkExperience[];
  References: CandidateReference[];
  "Professional References": CandidateProfessionalReference[];
}

export interface Candidate {
  unique_id: string;
  candidate_id: string | null;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  job_id: string;
  status: string;
  source_type: string;
  source_name: string;
  tags: string[];
  created_date: string;
  application_data: CandidateApplicationData;
}

export interface BulkCandidatesResponse {
  status: number;
  message: string;
  data: Candidate[];
}
