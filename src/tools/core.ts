import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { TokenManager } from '../auth/token.js';
import {
  EmployeeDetails,
  EmployeeUpdate,
  EmployeeHistory,
  PersonalDocs,
  PositionMaster,
  FormsData,
  SeparationDetails,
  AddEmployee,
  DeactivateEmployee,
  ProfileAttachment,
} from '../types/core.js';

export class CoreTools {
  constructor(private tokenManager: TokenManager, private datasetKey: string) {}

  async getEmployeeDetails(params: Partial<EmployeeDetails>) {
    const requestData: any = {
      datasetKey: this.datasetKey,
    };

    if (params.employee_ids) {
      requestData.employee_ids = params.employee_ids;
    } else if (params.last_modified) {
      requestData.last_modified = params.last_modified;
    }

    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/masterapi/employee',
      requestData
    );
  }

  async updateEmployee(params: EmployeeUpdate) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/importapi/update',
      { employees: [params.employee_data] }
    );
  }

  async getEmployeeHistory(params: EmployeeHistory) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/UpdateEmployeeDetails/employeehistory',
      params
    );
  }

  async downloadPersonalDocs(params: PersonalDocs) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/Employeedocs/downloadPersonalDocs',
      params
    );
  }

  async getPositionMaster(params: PositionMaster) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/orgmasterapi/getpositionMaster',
      params
    );
  }

  async getFormsData(params: FormsData) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/UpdateEmployeeDetails/getformsdata',
      params
    );
  }

  async getSeparationDetails(params: SeparationDetails) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/UpdateEmployeeDetails/separationDetails',
      params
    );
  }

  async addEmployee(params: AddEmployee) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/importapi/add',
      params
    );
  }

  async deactivateEmployee(params: DeactivateEmployee) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/importapi/deactivate',
      params
    );
  }

  async uploadProfileAttachments(params: ProfileAttachment) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/hrfileApi/profileAttachments',
      params
    );
  }
}
