import axios, { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { Config, TokenRequest, AuthResponse } from '../types/common.js';

export class TokenManager {
  private accessToken = '';
  private axiosInstance: AxiosInstance;

  constructor(private config: Config) {
    this.axiosInstance = axios.create({
      baseURL: config.domain,
    });
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken !== '') {
      return this.accessToken;
    }

    try {
      const tokenRequest: TokenRequest = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: this.config.grantType,
        code: this.config.code,
      };

      console.error('Token request:', JSON.stringify(tokenRequest, null, 2));
      const response = await this.axiosInstance.post('/oauth/v1token', tokenRequest);
      console.error('Token response:', JSON.stringify(response.data, null, 2));

      if (!response.data) {
        throw new McpError(
          ErrorCode.InternalError,
          'Empty response from token server'
        );
      }

      // The token might be directly in response.data or in response.data.access_token
      this.accessToken = typeof response.data === 'string' ? response.data : response.data.access_token;
      
      if (!this.accessToken) {
        throw new McpError(
          ErrorCode.InternalError,
          'No token found in response'
        );
      }

      return this.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error('Token error response:', JSON.stringify(responseData, null, 2));
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to obtain access token: ${responseData?.message || error.message}`
        );
      }
      throw new McpError(
        ErrorCode.InternalError,
        'Failed to obtain access token'
      );
    }
  }

  async makeAuthenticatedRequest(method: string, url: string, data?: any) {
    const token = await this.getAccessToken();
    try {
      console.error(`Making ${method} request to ${url}`);
      console.error('Request data:', JSON.stringify(data, null, 2));
      
      const response = await this.axiosInstance.request({
        method,
        url,
        data,
        headers: {
          'TOKEN': token,
          'Content-Type': 'application/json',
        },
      });
      
      console.error('Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error('Error response:', JSON.stringify(responseData, null, 2));
        throw new McpError(
          ErrorCode.InternalError,
          `API Error: ${responseData?.message || error.message}`
        );
      }
      throw error;
    }
  }
}
