export type RoleName = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_IT_STAFF';


export interface LoginResponse {
accessToken: string;
username: string;
email: string;
role: RoleName;
}


export interface RoleDTO {
id: number;
name: string;
description?: string;
}


export interface DepartmentDTO {
id: number;
name: string;
description?: string;
}


export interface CategoryDTO {
id: number;
name: string;
description?: string;
}


export interface UserDTO {
id: number;
username: string;
email: string;
roleName: string;
departmentName?: string;
}


export interface RequestDTO {
id: number;
title: string;
description?: string;
categoryName?: string;
createdByName?: string;
handledByName?: string;
status: boolean; // true = open, false = closed
}