import api from './axios';
import type { UserDTO } from "../types/UserDTO";
import type { LoginRequest, LoginResponse } from "../types/types";


// Users (Admin)
export const createUser = async (payload: any): Promise<{ message: string; data: UserDTO }> => {
const res = await api.post('/users', payload);
return res.data;
};


export const getAllUsers = async (): Promise<{ message: string; data: UserDTO[] }> => {
const res = await api.get('/users');
return res.data;
};


export const getUserById = async (id: number) => {
const res = await api.get(`/users/${id}`);
return res.data;
};


export const updateUser = async (id: number, payload: any) => {
const res = await api.put(`/users/${id}`, payload);
return res.data;
};


export const deleteUser = async (id: number) => {
const res = await api.delete(`/users/${id}`);
return res.data;
};


// Service Requests
export const createRequest = async (payload: any) => {
const res = await api.post('/requests', payload);
return res.data;
};


export const getRequestsByUser = async (email: string) => {
const res = await api.get(`/requests/user/${encodeURIComponent(email)}`);
return res.data;
};


export const getRequestsByItStaff = async (email: string) => {
const res = await api.get(`/requests/itstaff/${encodeURIComponent(email)}`);
return res.data;
};


export const closeRequest = async (requestId: number) => {
const res = await api.put(`/requests/${requestId}/close`);
return res.data;
};


export const deleteRequest = async (requestId: number) => {
const res = await api.delete(`/requests/${requestId}`);
return res.data;
};

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data;
};