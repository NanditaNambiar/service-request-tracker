import { useMutation } from "@tanstack/react-query";
import { login } from "../api/endpoints";
import type { LoginRequest, LoginResponse } from "../types/types";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (payload: LoginRequest) => login(payload)
  });
};
