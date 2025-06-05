type RequestReturn = {
  body?: Object;
  statusCode?: number;
  redirectUrl?: string;
};

export type RequestOption = {
  body: string | object | any;
  headers: { [key: string]: string };
  method: string;
  url: string;
  query: Record<string, string | number>;
  httpVersion: string;
};

export type CypressRequest = {
  url: string;
  hostname?: string;
  scenarioName: string;
  defaultScenario: Object;
  currentScenario: any;
  request: (req: RequestOption) => RequestReturn;
};
