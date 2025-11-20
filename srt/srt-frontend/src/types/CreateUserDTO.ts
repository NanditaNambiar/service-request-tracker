export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role: { id: number };
  department: { id: number };
  category: { id: number };
}
