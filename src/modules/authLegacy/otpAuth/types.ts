export type AuthState = {
  value: string;
};

export type AuthAction = { type: 'SET_VALUE'; payload: string };
