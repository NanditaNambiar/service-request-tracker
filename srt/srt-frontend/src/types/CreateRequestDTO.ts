export interface CreateRequestDTO {
  title: string;
  description: string;
  category: { id: number };
  createdBy: { id: number };
}
