export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  is_verified?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerify {
  email: string;
  otp: string;
}
