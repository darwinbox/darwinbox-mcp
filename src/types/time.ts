export interface MonthlyAttendance {
  emp_number_list: string[];
  from_date: string;
  to_date: string;
  month: string;
}

export interface DailyAttendance {
  emp_number_list: string[];
  attendance_date: string;
}

export interface AttendanceRoster {
  emp_number_list: string[];
  from_date: string;
  to_date: string;
}

export interface AttendancePunch {
  attendance: {
    [employeeId: string]: Array<{
      id: string;
      timestamp: string;
      machineid: string;
      status: string;
    }>;
  };
}

export interface BackdatedAttendance {
  attendance_data: Array<{
    employee_no: string;
    shift_date: string;
    in_time_date: string;
    in_time: string;
    out_time_date: string;
    out_time: string;
    shift_name: string;
    policy_name: string;
    weekly_off_name: string;
    break_duration: string;
  }>;
}

export interface LeaveAction {
  leave_id: string;
  employee_no: string;
  action: string;
  manager_message: string;
}

export interface LeaveActionHistory {
  from: string;
  to: string;
  action: string;
  employee_no: string[];
  unpaid: string;
}

export interface HolidayList {
  year: string;
  employee_no: string;
}

export interface LeaveBalance {
  ignore_rounding: string;
  employee_nos: string[];
}

export interface LeaveBalanceResponse {
  status: number;
  data: Array<{
    employee_name: string;
    employee_no: string;
    leave_id: string;
    leave_name: string;
    currently_availabel_balance: number;
    accrued_so_far_this_year: number;
    previous_balance: number;
    adjustment_balance: number;
    yearly_allotment: string;
    taken: number;
    utilized_leaves_this_year: string | number;
  }>;
  message: string;
}

export interface ImportLeave {
  data: Array<{
    employee_no: string;
    leave_name: string;
    message: string;
    from_date: string;
    to_date: string;
    is_half_day: 'Yes' | 'No';
    is_firsthalf_secondhalf: '1' | '2';
    is_paid_or_unpaid: 'paid' | 'unpaid';
    revoke_leave: 'Yes' | 'No';
    revoke_reason: string;
  }>;
}
