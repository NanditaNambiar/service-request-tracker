import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, createUser } from '../api/endpoints';

// GET ALL USERS (ADMIN)
export function useAllUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
}

// CREATE USER (ADMIN)
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
