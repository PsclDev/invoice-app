export interface HealthResponse {
  version: string;
  status: string;
  info: {
    api: {
      status: string;
    };
    database: {
      status: string;
    };
  };
}
