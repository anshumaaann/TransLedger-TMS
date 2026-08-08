import api from "./api";

export type UserRole = "admin" | "dispatcher" | "accountant" | "viewer";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export type CreateUserInput = {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
};

export const login = async (email: string, password: string) =>
  (await api.post<LoginResponse>("/auth/login", { email, password })).data;

export const getCurrentUser = async () =>
  (await api.get<AuthUser>("/auth/me")).data;

export const getUsers = async () =>
  (await api.get<AuthUser[]>("/users")).data;

export const createUser = async (user: CreateUserInput) =>
  (await api.post<AuthUser>("/users", user)).data;

export const updateUser = async (userId: string, values: Partial<Pick<AuthUser, "full_name" | "role" | "is_active">>) =>
  (await api.patch<AuthUser>(`/users/${userId}`, values)).data;

export const changePassword = async (current_password: string, new_password: string) =>
  api.post("/auth/change-password", { current_password, new_password });
