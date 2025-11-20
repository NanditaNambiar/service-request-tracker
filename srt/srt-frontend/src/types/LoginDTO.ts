export interface LoginResponse {
  id: number;                     // ✅ Required
  accessToken: string;
  username: string;
  email: string;
  role: string; // e.g., "ADMIN", "USER", "IT_STAFF"
}
