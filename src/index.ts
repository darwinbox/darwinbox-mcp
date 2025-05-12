#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { TokenManager } from './auth/token.js';
import { CoreTools } from './tools/core.js';
import { TimeTools } from './tools/time.js';
import { ReqTools } from './req/tools.js';
import { Config } from './types/common.js';
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
} from './types/core.js';
import {
  MonthlyAttendance,
  DailyAttendance,
  AttendanceRoster,
  AttendancePunch,
  BackdatedAttendance,
  LeaveAction,
  LeaveActionHistory,
  HolidayList,
  LeaveBalance,
  ImportLeave,
} from './types/time.js';
import {
  JobListingParams,
  JobDetailParams,
  BulkCandidatesParams,
} from './types/req.js';

// Environment variables from MCP server configuration
const config: Config = {
  domain: process.env.DARWINBOX_DOMAIN || '',
  clientId: process.env.DARWINBOX_CLIENT_ID || '',
  clientSecret: process.env.DARWINBOX_CLIENT_SECRET || '',
  grantType: process.env.DARWINBOX_GRANT_TYPE || '',
  code: process.env.DARWINBOX_CODE || '',
  datasetKey: process.env.DARWINBOX_DATASET_KEY || '',
};

if (!config.domain || !config.clientId || !config.clientSecret || !config.grantType || !config.code || !config.datasetKey) {
  throw new Error('Required environment variables are missing');
}

class DarwinboxServer {
  private server: Server;
  private tokenManager: TokenManager;
  private coreTools: CoreTools;
  private timeTools: TimeTools;
  private reqTools: ReqTools;

  constructor() {
    this.server = new Server(
      {
        name: 'darwinbox-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tokenManager = new TokenManager(config);
    this.coreTools = new CoreTools(this.tokenManager, config.datasetKey);
    this.timeTools = new TimeTools(this.tokenManager);
    this.reqTools = new ReqTools(this.tokenManager);

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Core Tools
        {
          name: 'get_employee_details',
          description: 'Retrieve comprehensive employee information with flexible filtering options. Can fetch all employees, specific employees by IDs, or employees modified after a certain date.',
          inputSchema: {
            type: 'object',
            properties: {
              employee_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of employee IDs to fetch details for specific employees (use array with single ID for one employee)',
              },
              last_modified: {
                type: 'string',
                description: 'ISO date string (DD-MM-YYYY HH:mm:ss) to fetch employees modified after this timestamp',
              },
            },
            oneOf: [
              { required: [] }, // fetch all employees
              { required: ['employee_ids'] }, // fetch specific employees
              { required: ['last_modified'] }, // fetch changed employees
            ],
          },
        },
        {
          name: 'update_employee',
          description: 'Update employee information including personal details, work information, and other employee-related data.',
          inputSchema: {
            type: 'object',
            properties: {
              employee_data: {
                type: 'object',
                description: 'Employee data object containing fields to update',
                required: true
              }
            },
            required: ['employee_data']
          }
        },
        {
          name: 'get_employee_history',
          description: 'Retrieve historical changes and updates made to employee records within a specified date range.',
          inputSchema: {
            type: 'object',
            properties: {
              from: {
                type: 'string',
                description: 'Start date in DD-MM-YYYY format'
              },
              to: {
                type: 'string',
                description: 'End date in DD-MM-YYYY format'
              },
              filter_on_effective_date: {
                type: 'number',
                description: 'Filter flag for effective date (0 or 1)'
              }
            },
            required: ['from', 'to', 'filter_on_effective_date']
          }
        },
        {
          name: 'download_personal_docs',
          description: 'Download employee personal documents such as profile pictures, ID proofs, or other uploaded documents.',
          inputSchema: {
            type: 'object',
            properties: {
              employee_no: {
                type: 'string',
                description: 'Employee number whose documents to download'
              },
              for: {
                type: 'string',
                description: 'Document type to download (e.g., profile_pic, id_proof)'
              }
            },
            required: ['employee_no', 'for']
          }
        },
        {
          name: 'get_position_master',
          description: 'Retrieve organizational position data including current positions, vacancies, and hiring needs.',
          inputSchema: {
            type: 'object',
            properties: {
              status: {
                type: 'number',
                description: 'Position status code'
              },
              need_to_hire: {
                type: 'number',
                description: 'Flag for positions that need hiring (0 or 1)'
              },
              employee_nos: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of employee numbers to filter positions'
              }
            },
            required: ['status', 'need_to_hire', 'employee_nos']
          }
        },
        {
          name: 'get_forms_data',
          description: 'Retrieve form data and submissions within a specified date range.',
          inputSchema: {
            type: 'object',
            properties: {
              form_id: {
                type: 'string',
                description: 'Form identifier'
              },
              type: {
                type: 'string',
                description: 'Type of form'
              },
              form_type: {
                type: 'string',
                description: 'Form type category'
              },
              from: {
                type: 'string',
                description: 'Start date'
              },
              to: {
                type: 'string',
                description: 'End date'
              }
            },
            required: ['form_id', 'type', 'form_type', 'from', 'to']
          }
        },
        {
          name: 'get_separation_details',
          description: 'Get details about employee separations.',
          inputSchema: {
            type: 'object',
            properties: {
              separation_status: {
                type: 'string',
                description: 'Status of separation'
              },
              employee_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of employee IDs'
              }
            },
            required: ['separation_status', 'employee_ids']
          }
        },
        {
          name: 'add_employee',
          description: 'Add new employees to the system.',
          inputSchema: {
            type: 'object',
            properties: {
              employees: {
                type: 'object',
                description: 'Employee data to add'
              }
            },
            required: ['employees']
          }
        },
        {
          name: 'deactivate_employee',
          description: 'Deactivate employees in the system.',
          inputSchema: {
            type: 'object',
            properties: {
              employees: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    employee_id: { type: 'string' },
                    deactivate_type: { type: 'string' },
                    deactivate_reason: { type: 'string' },
                    date_of_resignation: { type: 'string' },
                    date_of_exit: { type: 'string' }
                  }
                },
                description: 'List of employees to deactivate'
              }
            },
            required: ['employees']
          }
        },
        {
          name: 'upload_profile_attachments',
          description: 'Upload attachments to employee profiles.',
          inputSchema: {
            type: 'object',
            properties: {
              employee_no: {
                type: 'string',
                description: 'Employee number'
              },
              section: {
                type: 'string',
                description: 'Profile section'
              },
              section_attribute: {
                type: 'string',
                description: 'Section attribute'
              },
              attachment: {
                type: 'string',
                description: 'Attachment data'
              }
            },
            required: ['employee_no', 'section', 'section_attribute', 'attachment']
          }
        },
        // Time Management Tools
        {
          name: 'get_monthly_attendance',
          description: 'Retrieve detailed monthly attendance records for specified employees, including check-in/out times and attendance status.',
          inputSchema: {
            type: 'object',
            properties: {
              emp_number_list: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of employee numbers to fetch attendance for'
              },
              from_date: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format'
              },
              to_date: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format'
              },
              month: {
                type: 'string',
                description: 'Month in YYYY-MM format'
              }
            },
            required: ['emp_number_list', 'from_date', 'to_date', 'month']
          }
        },
        {
          name: 'record_attendance_punches',
          description: 'Record employee attendance punches with timestamp and location details. Supports both check-in and check-out records.',
          inputSchema: {
            type: 'object',
            properties: {
              attendance: {
                type: 'object',
                description: 'Map of employee IDs to their attendance punch records',
                additionalProperties: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      timestamp: { type: 'string', description: 'YYYY-MM-DD HH:mm:ss format' },
                      machineid: { type: 'string' },
                      status: { type: 'string' }
                    }
                  }
                }
              }
            },
            required: ['attendance']
          }
        },
        {
          name: 'get_daily_attendance',
          description: 'Get daily attendance records for employees.',
          inputSchema: {
            type: 'object',
            properties: {
              emp_number_list: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of employee numbers'
              },
              from_date: {
                type: 'string',
                description: 'Start date'
              },
              to_date: {
                type: 'string',
                description: 'End date'
              }
            },
            required: ['emp_number_list', 'from_date', 'to_date']
          }
        },
        {
          name: 'get_attendance_roster',
          description: 'Get attendance roster information.',
          inputSchema: {
            type: 'object',
            properties: {
              emp_number_list: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of employee numbers'
              },
              from_date: {
                type: 'string',
                description: 'Start date'
              },
              to_date: {
                type: 'string',
                description: 'End date'
              }
            },
            required: ['emp_number_list', 'from_date', 'to_date']
          }
        },
        {
          name: 'record_backdated_attendance',
          description: 'Record backdated attendance entries.',
          inputSchema: {
            type: 'object',
            properties: {
              attendance: {
                type: 'object',
                description: 'Backdated attendance data'
              }
            },
            required: ['attendance']
          }
        },
        {
          name: 'approve_leave',
          description: 'Approve or reject existing leave requests.',
          inputSchema: {
            type: 'object',
            properties: {
              leave_id: {
                type: 'string',
                description: 'ID of the leave request to approve/reject'
              },
              employee_no: {
                type: 'string',
                description: 'Employee number'
              },
              action: {
                type: 'string',
                description: 'Action to take (approve/reject)'
              },
              manager_message: {
                type: 'string',
                description: 'Optional message from manager'
              }
            },
            required: ['leave_id', 'employee_no', 'action']
          }
        },
        {
          name: 'get_leave_action_history',
          description: 'Get history of leave actions.',
          inputSchema: {
            type: 'object',
            properties: {
              history: {
                type: 'object',
                description: 'Leave action history parameters'
              }
            },
            required: ['history']
          }
        },
        {
          name: 'get_holiday_list',
          description: 'Get list of holidays.',
          inputSchema: {
            type: 'object',
            properties: {
              list: {
                type: 'object',
                description: 'Holiday list parameters'
              }
            },
            required: ['list']
          }
        },
        {
          name: 'apply_leave',
          description: 'Apply for a new leave.',
          inputSchema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    employee_no: {
                      type: 'string',
                      description: 'Employee number'
                    },
                    leave_name: {
                      type: 'string',
                      description: 'Type of leave'
                    },
                    message: {
                      type: 'string',
                      description: 'Leave reason/message'
                    },
                    from_date: {
                      type: 'string',
                      description: 'Leave start date (DD-MM-YYYY)'
                    },
                    to_date: {
                      type: 'string',
                      description: 'Leave end date (DD-MM-YYYY)'
                    },
                    is_half_day: {
                      type: 'string',
                      description: 'Whether this is a half day leave',
                      enum: ['Yes', 'No'],
                      default: 'No'
                    },
                    is_firsthalf_secondhalf: {
                      type: 'string',
                      description: 'For half day leaves, specify 1 for first half or 2 for second half',
                      enum: ['1', '2'],
                      default: '1'
                    },
                    is_paid_or_unpaid: {
                      type: 'string',
                      description: 'Whether this is a paid or unpaid leave',
                      enum: ['paid', 'unpaid'],
                      default: 'paid'
                    },
                    revoke_leave: {
                      type: 'string',
                      description: 'Whether to revoke this leave',
                      enum: ['Yes', 'No'],
                      default: 'No'
                    },
                    revoke_reason: {
                      type: 'string',
                      description: 'Reason for revoking the leave (required if revoke_leave is Yes)'
                    }
                  },
                  required: ['employee_no', 'leave_name', 'message', 'from_date', 'to_date', 'is_half_day', 'is_paid_or_unpaid', 'revoke_leave']
                }
              }
            },
            required: ['data']
          }
        },
        {
          name: 'get_leave_balance',
          description: 'Retrieve available leave types and their balances for specified employees. Use this API before applying for leave to get the list of valid leave types.',
          inputSchema: {
            type: 'object',
            properties: {
              ignore_rounding: {
                type: 'string',
                description: 'Whether to ignore rounding in balance calculation (0 or 1)',
                default: '0'
              },
              employee_nos: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of employee numbers to fetch leave balances for'
              }
            },
            required: ['employee_nos']
          }
        },
        // Recruitment Tools
        {
          name: 'get_job_listings',
          description: 'Retrieve a list of all open jobs updated after a specified timestamp.',
          inputSchema: {
            type: 'object',
            properties: {
              job_updated_timestamp_from: {
                type: 'string',
                description: 'Fetch jobs updated after this timestamp (DD-MM-YYYY HH:mm:ss format)'
              }
            },
            required: ['job_updated_timestamp_from']
          }
        },
        {
          name: 'get_job_detail',
          description: 'Get detailed information about a specific job posting.',
          inputSchema: {
            type: 'object',
            properties: {
              job_id: {
                type: 'string',
                description: 'Unique identifier of the job to fetch details for'
              }
            },
            required: ['job_id']
          }
        },
        {
          name: 'get_bulk_candidates',
          description: 'Retrieve candidate data for applications within a specified time range.',
          inputSchema: {
            type: 'object',
            properties: {
              updated_from: {
                type: 'string',
                description: 'Start timestamp (DD-MM-YYYY HH:mm:ss format)'
              },
              updated_to: {
                type: 'string',
                description: 'End timestamp (DD-MM-YYYY HH:mm:ss format)'
              }
            },
            required: ['updated_from', 'updated_to']
          }
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Missing required arguments'
        );
      }

      try {
        let result;

        // Core Tools
        if (name === 'get_employee_details') {
          result = await this.coreTools.getEmployeeDetails(args as unknown as Partial<EmployeeDetails>);
        } else if (name === 'update_employee') {
          result = await this.coreTools.updateEmployee(args as unknown as EmployeeUpdate);
        } else if (name === 'get_employee_history') {
          result = await this.coreTools.getEmployeeHistory(args as unknown as EmployeeHistory);
        } else if (name === 'download_personal_docs') {
          result = await this.coreTools.downloadPersonalDocs(args as unknown as PersonalDocs);
        } else if (name === 'get_position_master') {
          result = await this.coreTools.getPositionMaster(args as unknown as PositionMaster);
        } else if (name === 'get_forms_data') {
          result = await this.coreTools.getFormsData(args as unknown as FormsData);
        } else if (name === 'get_separation_details') {
          result = await this.coreTools.getSeparationDetails(args as unknown as SeparationDetails);
        } else if (name === 'add_employee') {
          result = await this.coreTools.addEmployee(args as unknown as AddEmployee);
        } else if (name === 'deactivate_employee') {
          result = await this.coreTools.deactivateEmployee(args as unknown as DeactivateEmployee);
        } else if (name === 'upload_profile_attachments') {
          result = await this.coreTools.uploadProfileAttachments(args as unknown as ProfileAttachment);
        }
        // Time Management Tools
        else if (name === 'get_monthly_attendance') {
          result = await this.timeTools.getMonthlyAttendance(args as unknown as MonthlyAttendance);
        } else if (name === 'get_daily_attendance') {
          result = await this.timeTools.getDailyAttendance(args as unknown as DailyAttendance);
        } else if (name === 'get_attendance_roster') {
          result = await this.timeTools.getAttendanceRoster(args as unknown as AttendanceRoster);
        } else if (name === 'record_attendance_punches') {
          result = await this.timeTools.recordAttendancePunches(args as unknown as AttendancePunch);
        } else if (name === 'record_backdated_attendance') {
          result = await this.timeTools.recordBackdatedAttendance(args as unknown as BackdatedAttendance);
        } else if (name === 'approve_leave') {
          result = await this.timeTools.approveLeave(args as unknown as LeaveAction);
        } else if (name === 'get_leave_action_history') {
          result = await this.timeTools.getLeaveActionHistory(args as unknown as LeaveActionHistory);
        } else if (name === 'get_holiday_list') {
          result = await this.timeTools.getHolidayList(args as unknown as HolidayList);
        } else if (name === 'get_leave_balance') {
          result = await this.timeTools.getLeaveBalance(args as unknown as LeaveBalance);
        } else if (name === 'import_leave') {
          result = await this.timeTools.importLeave(args as unknown as ImportLeave);
        } else if (name === 'apply_leave') {
          result = await this.timeTools.applyLeave(args as unknown as ImportLeave);
        }
        // Recruitment Tools
        else if (name === 'get_job_listings') {
          result = await this.reqTools.getJobListings(args as unknown as JobListingParams);
        } else if (name === 'get_job_detail') {
          result = await this.reqTools.getJobDetail(args as unknown as JobDetailParams);
        } else if (name === 'get_bulk_candidates') {
          result = await this.reqTools.getBulkCandidates(args as unknown as BulkCandidatesParams);
        } else {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        if (error instanceof McpError) {
          throw error;
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${errorMessage}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Darwinbox MCP server running on stdio');
  }
}

const server = new DarwinboxServer();
server.run().catch(console.error);
