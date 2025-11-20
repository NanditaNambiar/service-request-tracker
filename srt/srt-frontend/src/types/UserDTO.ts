export interface UserDTO {
  id: number;
  username: string;
  email: string;

  // Backend fields:
  roleName?: string;
  departmentName?: string;
  categoryName?: string;

  // For create/update requests:
  role?: { id: number };
  department?: { id: number };
  category?: { id: number };
}
