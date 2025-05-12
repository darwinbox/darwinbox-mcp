import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { TokenManager } from '../auth/token.js';
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
} from '../types/time.js';

export class TimeTools {
  constructor(private tokenManager: TokenManager) {}

  async getMonthlyAttendance(params: MonthlyAttendance) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/AttendanceDataApi/monthly',
      params
    );
  }

  async getDailyAttendance(params: DailyAttendance) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/AttendanceDataApi/daily',
      params
    );
  }

  async getAttendanceRoster(params: AttendanceRoster) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/attendanceDataApi/DailyAttendanceRoster',
      params
    );
  }

  async recordAttendancePunches(params: AttendancePunch) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/AttendancePunchesApi',
      params
    );
  }

  async recordBackdatedAttendance(params: BackdatedAttendance) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/attendanceDataApi/backdatedattendance',
      params
    );
  }

  async approveLeave(params: LeaveAction) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/leavesactionapi/leaveaction',
      params
    );
  }

  async getLeaveActionHistory(params: LeaveActionHistory) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/leavesactionapi/leaveActionTakenLeaves',
      params
    );
  }

  async getHolidayList(params: HolidayList) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/leavesactionapi/holidaylist',
      params
    );
  }

  async getLeaveBalance(params: LeaveBalance) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/leavesactionapi/leavebalance',
      params
    );
  }

  async importLeave(params: ImportLeave) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/leavesactionapi/importleave',
      params
    );
  }

  async applyLeave(params: ImportLeave) {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/leavesactionapi/importleave',
      params
    );
  }
}
