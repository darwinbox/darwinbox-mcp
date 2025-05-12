import { TokenManager } from '../auth/token.js';
import {
  JobListingParams,
  JobListingResponse,
  JobDetailParams,
  JobDetailResponse,
  BulkCandidatesParams,
  BulkCandidatesResponse,
} from '../types/req.js';

export class ReqTools {
  constructor(private tokenManager: TokenManager) {}

  async getJobListings(params: JobListingParams): Promise<JobListingResponse> {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/JobsApiv3/Joblist',
      params
    );
  }

  async getJobDetail(params: JobDetailParams): Promise<JobDetailResponse> {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/JobsApiv2/Jobdetail',
      params
    );
  }

  async getBulkCandidates(params: BulkCandidatesParams): Promise<BulkCandidatesResponse> {
    return this.tokenManager.makeAuthenticatedRequest(
      'POST',
      '/JobsApiv3/BulkCandidatesData',
      params
    );
  }
}
