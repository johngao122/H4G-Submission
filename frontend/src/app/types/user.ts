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

export interface UserFormData {
    name: string;
    phoneNumber: string;
    username: string;
    password: string;
    role: "resident" | "admin";
}

export interface UserMetadata {
    role: "resident" | "admin";
    voucherBalance?: number;
}
