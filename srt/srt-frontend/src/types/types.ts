export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  accessToken: string;
  username: string;
  email: string;
  role: string; // "ADMIN" | "USER" | "ITSTAFF"
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: string;
}
