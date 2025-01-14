type userRole = "resident" | "admin";

export interface User {
    id: string;
    name: string;
    role: userRole;
    voucherBalance: number;
    status: "ACTIVE" | "SUSPENDED";
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    id: string;
    name: string;
    role: userRole;
}

export interface UserResponse {
    success: boolean;
    data?: User;
    error?: string;
}
