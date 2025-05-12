export interface AuthResponse {
  access_token: string;
}

export interface TokenRequest {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
}

export interface Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
  code: string;
  datasetKey: string;
}

export interface RequestOptions {
  method: string;
  url: string;
  data?: any;
}
