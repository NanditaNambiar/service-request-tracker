# Service Request Tracker - API Endpoints Documentation

## Overview
This document lists all REST API endpoints available in the Service Request Tracker (SRT) application. The application uses JWT (JSON Web Tokens) for authentication and PostgreSQL for data persistence.

---

## Base URL
```
http://localhost:8080
```

---

## Authentication
Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

### JWT Token Claims
- **subject** (username): Email address of the user
- **role**: User role (e.g., ROLE_ADMIN, ROLE_USER, ROLE_IT_STAFF)
- **expiration**: Token expires after 30 days (configurable in application.properties)

---

## Public Endpoints (No Authentication Required)

### 1. Login
**Endpoint:** `POST /auth/login`
- **Description:** Authenticate user and receive JWT token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "John Doe",
    "email": "user@example.com",
    "role": "ROLE_USER"
  }
  ```

### 2. Get All Roles
**Endpoint:** `GET /api/roles`
- **Description:** Retrieve all available roles
- **Response (200 OK):**
  ```json
  {
    "message": "Roles retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "ROLE_ADMIN",
        "description": "Administrator role"
      }
    ]
  }
  ```

### 3. Get Role by ID
**Endpoint:** `GET /api/roles/{id}`
- **Description:** Get a specific role by ID
- **Path Parameters:** `id` (Long) - Role ID
- **Response (200 OK):**
  ```json
  {
    "message": "Role retrieved successfully",
    "data": {
      "id": 1,
      "name": "ROLE_ADMIN",
      "description": "Administrator role"
    }
  }
  ```

### 4. Get Role by Name
**Endpoint:** `GET /api/roles/name/{name}`
- **Description:** Get a specific role by name
- **Path Parameters:** `name` (String) - Role name
- **Response (200 OK):**
  ```json
  {
    "message": "Role retrieved successfully",
    "data": {
      "id": 1,
      "name": "ROLE_ADMIN",
      "description": "Administrator role"
    }
  }
  ```

### 5. Create Role
**Endpoint:** `POST /api/roles`
- **Description:** Create a new role
- **Request Body:**
  ```json
  {
    "name": "ROLE_NEW",
    "description": "New role description"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Role created successfully",
    "data": {
      "id": 3,
      "name": "ROLE_NEW",
      "description": "New role description"
    }
  }
  ```

### 6. Delete Role
**Endpoint:** `DELETE /api/roles/{id}`
- **Description:** Delete a role by ID
- **Path Parameters:** `id` (Long) - Role ID
- **Response (204 No Content):**
  ```json
  {
    "message": "Role deleted successfully",
    "data": null
  }
  ```

### 7. Get All Departments
**Endpoint:** `GET /departments`
- **Description:** Retrieve all departments
- **Response (200 OK):**
  ```json
  {
    "message": "Departments retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "IT Support",
        "description": "IT Support Department"
      }
    ]
  }
  ```

### 8. Get Department by ID
**Endpoint:** `GET /departments/{id}`
- **Description:** Get a specific department by ID
- **Path Parameters:** `id` (Long) - Department ID
- **Response (200 OK):**
  ```json
  {
    "message": "Department retrieved successfully",
    "data": {
      "id": 1,
      "name": "IT Support",
      "description": "IT Support Department"
    }
  }
  ```

### 9. Create Department
**Endpoint:** `POST /departments`
- **Description:** Create a new department
- **Request Body:**
  ```json
  {
    "name": "HR Department",
    "description": "Human Resources Department"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Department created successfully",
    "data": {
      "id": 2,
      "name": "HR Department",
      "description": "Human Resources Department"
    }
  }
  ```

### 10. Delete Department
**Endpoint:** `DELETE /departments/{id}`
- **Description:** Delete a department by ID
- **Path Parameters:** `id` (Long) - Department ID
- **Response (204 No Content):**
  ```json
  {
    "message": "Department deleted successfully",
    "data": null
  }
  ```

### 11. Get All Categories
**Endpoint:** `GET /categories`
- **Description:** Retrieve all service request categories
- **Response (200 OK):**
  ```json
  {
    "message": "Categories retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "Hardware",
        "description": "Hardware related issues"
      }
    ]
  }
  ```

### 12. Get Category by ID
**Endpoint:** `GET /categories/{id}`
- **Description:** Get a specific category by ID
- **Path Parameters:** `id` (Long) - Category ID
- **Response (200 OK):**
  ```json
  {
    "message": "Category retrieved successfully",
    "data": {
      "id": 1,
      "name": "Hardware",
      "description": "Hardware related issues"
    }
  }
  ```

### 13. Create Category
**Endpoint:** `POST /categories`
- **Description:** Create a new service request category
- **Request Body:**
  ```json
  {
    "name": "Software",
    "description": "Software related issues"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Category created successfully",
    "data": {
      "id": 2,
      "name": "Software",
      "description": "Software related issues"
    }
  }
  ```

### 14. Delete Category
**Endpoint:** `DELETE /categories/{id}`
- **Description:** Delete a category by ID
- **Path Parameters:** `id` (Long) - Category ID
- **Response (204 No Content):**
  ```json
  {
    "message": "Category deleted successfully",
    "data": null
  }
  ```

---

## Protected Endpoints (Authentication Required)

### User Management (Admin Only)

#### 15. Create User
**Endpoint:** `POST /users`
- **Authorization:** ADMIN role
- **Description:** Create a new user
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": {
      "id": 1
    },
    "department": {
      "id": 1
    },
    "category": {
      "id": 1
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "User created successfully",
    "data": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "roleName": "ROLE_USER",
      "departmentName": "IT Support"
    }
  }
  ```

#### 16. Get All Users
**Endpoint:** `GET /users`
- **Authorization:** ADMIN role
- **Description:** Retrieve all users
- **Response (200 OK):**
  ```json
  {
    "message": "All users retrieved successfully",
    "data": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "roleName": "ROLE_USER",
        "departmentName": "IT Support"
      }
    ]
  }
  ```

#### 17. Get User by ID
**Endpoint:** `GET /users/{id}`
- **Authorization:** ADMIN role
- **Description:** Get a specific user by ID
- **Path Parameters:** `id` (Long) - User ID
- **Response (200 OK):**
  ```json
  {
    "message": "User retrieved successfully",
    "data": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "roleName": "ROLE_USER",
      "departmentName": "IT Support"
    }
  }
  ```

#### 18. Update User
**Endpoint:** `PUT /users/{id}`
- **Authorization:** ADMIN role
- **Description:** Update user details
- **Path Parameters:** `id` (Long) - User ID
- **Request Body:**
  ```json
  {
    "username": "john_doe_updated",
    "email": "john_new@example.com",
    "password": "NewSecurePass123",
    "role": {
      "id": 1
    },
    "department": {
      "id": 2
    },
    "category": {
      "id": 1
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "User updated successfully",
    "data": {
      "id": 1,
      "username": "john_doe_updated",
      "email": "john_new@example.com",
      "roleName": "ROLE_USER",
      "departmentName": "HR Department"
    }
  }
  ```

#### 19. Delete User
**Endpoint:** `DELETE /users/{id}`
- **Authorization:** ADMIN role
- **Description:** Delete a user by ID
- **Path Parameters:** `id` (Long) - User ID
- **Response (200 OK):**
  ```json
  {
    "message": "User deleted successfully",
    "data": null
  }
  ```
- **Error Response (409 Conflict):**
  ```json
  {
    "message": "Cannot delete user — this user has submitted service requests.",
    "data": null
  }
  ```

---

### Service Request Management

#### 20. Create Service Request
**Endpoint:** `POST /requests`
- **Authorization:** USER or ADMIN role
- **Description:** Create a new service request
- **Request Body:**
  ```json
  {
    "title": "Network Connectivity Issue",
    "description": "Cannot connect to the office network",
    "category": {
      "id": 1
    },
    "createdBy": {
      "id": 1
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Service request created successfully",
    "data": {
      "id": 1,
      "title": "Network Connectivity Issue",
      "description": "Cannot connect to the office network",
      "categoryName": "Hardware",
      "createdByName": "john_doe",
      "handledByName": "it_staff_name",
      "status": true
    }
  }
  ```

#### 21. Get Requests for User
**Endpoint:** `GET /requests/user/{email}`
- **Authorization:** User's own email or ADMIN role
- **Description:** Get all service requests created by a specific user
- **Path Parameters:** `email` (String) - User email address
- **Response (200 OK):**
  ```json
  {
    "message": "User requests retrieved successfully",
    "data": [
      {
        "id": 1,
        "title": "Network Connectivity Issue",
        "description": "Cannot connect to the office network",
        "categoryName": "Hardware",
        "createdByName": "john_doe",
        "handledByName": "it_staff_name",
        "status": true
      }
    ]
  }
  ```

#### 22. Get Requests for IT Staff
**Endpoint:** `GET /requests/itstaff/{email}`
- **Authorization:** IT staff's own email or ADMIN role
- **Description:** Get all service requests assigned to a specific IT staff member
- **Path Parameters:** `email` (String) - IT staff email address
- **Response (200 OK):**
  ```json
  {
    "message": "IT staff requests retrieved successfully",
    "data": [
      {
        "id": 1,
        "title": "Network Connectivity Issue",
        "description": "Cannot connect to the office network",
        "categoryName": "Hardware",
        "createdByName": "john_doe",
        "handledByName": "it_staff_name",
        "status": true
      }
    ]
  }
  ```

#### 23. Close Service Request
**Endpoint:** `PUT /requests/{requestId}/close`
- **Authorization:** IT_STAFF or ADMIN role
- **Description:** Close a service request (mark as resolved)
- **Path Parameters:** `requestId` (Long) - Service Request ID
- **Response (200 OK):**
  ```json
  {
    "message": "Service request closed successfully",
    "data": {
      "id": 1,
      "title": "Network Connectivity Issue",
      "description": "Cannot connect to the office network",
      "categoryName": "Hardware",
      "createdByName": "john_doe",
      "handledByName": "it_staff_name",
      "status": false
    }
  }
  ```

#### 24. Delete Service Request
**Endpoint:** `DELETE /requests/{requestId}`
- **Authorization:** IT_STAFF or ADMIN role
- **Description:** Delete a service request
- **Path Parameters:** `requestId` (Long) - Service Request ID
- **Response (200 OK):**
  ```json
  {
    "message": "Service request deleted successfully",
    "data": null
  }
  ```

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2025-11-17T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request body or parameters",
  "path": "/api/endpoint"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2025-11-17T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing JWT token",
  "path": "/api/endpoint"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2025-11-17T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied - insufficient permissions",
  "path": "/api/endpoint"
}
```

### 404 Not Found
```json
{
  "timestamp": "2025-11-17T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with ID: 999",
  "path": "/api/endpoint"
}
```

### 409 Conflict
```json
{
  "timestamp": "2025-11-17T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Cannot delete user — this user has submitted service requests",
  "path": "/users/1"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2025-11-17T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Something went wrong",
  "path": "/api/endpoint"
}
```

---

## User Roles and Permissions

| Role | Create User | Get Users | Delete User | Create Request | Get Own Requests | Get Assigned Requests | Close Request | Delete Request |
|------|-------------|-----------|-------------|-----------------|------------------|----------------------|---|---|
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **USER** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **IT_STAFF** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

---

## Summary of Endpoints by Category

### Authentication (1)
- POST /auth/login

### Role Management (4)
- GET /api/roles
- GET /api/roles/{id}
- GET /api/roles/name/{name}
- POST /api/roles
- DELETE /api/roles/{id}

### Department Management (4)
- GET /departments
- GET /departments/{id}
- POST /departments
- DELETE /departments/{id}

### Category Management (4)
- GET /categories
- GET /categories/{id}
- POST /categories
- DELETE /categories/{id}

### User Management (5)
- POST /users
- GET /users
- GET /users/{id}
- PUT /users/{id}
- DELETE /users/{id}

### Service Request Management (5)
- POST /requests
- GET /requests/user/{email}
- GET /requests/itstaff/{email}
- PUT /requests/{requestId}/close
- DELETE /requests/{requestId}

**Total Endpoints: 24**

---

## Notes

1. **Password Hashing:** All passwords are hashed using BCryptPasswordEncoder before storage
2. **JWT Expiration:** Tokens expire after 30 days (configurable)
3. **Database:** PostgreSQL is used for persistence
4. **CORS:** Enabled for all origins (`*`)
5. **Round-Robin Assignment:** Service requests are automatically assigned to IT staff using round-robin distribution per category
