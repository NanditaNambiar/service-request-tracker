export interface RequestDTO {
  id: number;
  title: string;
  description: string;
  categoryName: string;
  createdByName: string;
  handledByName: string | null;
  status: boolean; // true = open, false = closed
}
