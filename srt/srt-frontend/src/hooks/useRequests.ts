import { useMutation } from "@tanstack/react-query";
import { createRequest } from "../api/endpoints";

interface CreateRequestPayload {
  title: string;
  description: string;
  category: { id: number };
  createdBy: { id: number };
}

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
  });
};
