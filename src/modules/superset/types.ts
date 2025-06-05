export type GuestTokenPayload = {
  dashboard_id: string;
  dashboard_uuid: string;
};

export type SupersetState = {
  isLoading: boolean;
  guestToken: string | null;
  error: string | null;
};
