export interface AxiosErrorShape {
  response?: {
    data?: {
      detail?: string;
    }
  };
  message?: string;
}

export interface Domain {
  domain: string;
  list_type: "blacklist" | "whitelist";
}
