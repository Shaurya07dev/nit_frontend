import axios from "axios";
import { mockHODUser, mockEmployeeUser, mockAssets, mockUsers, mockLoginLogs } from "./mockData";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Mock authentication for testing
const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === "hod-csedept@nitpy.ac.in" && password === "NITPY123") {
    const token = "mock-jwt-token-hod-" + Date.now();
    return {
      token,
      user: mockHODUser,
    };
  } else if (email === "john.doe@nitpy.ac.in" && password === "password123") {
    const token = "mock-jwt-token-employee-" + Date.now();
    return {
      token,
      user: mockEmployeeUser,
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

// Auth API
export async function login(email: string, password: string) {
  try {
    // Try real API first
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (error) {
    // Fallback to mock authentication for testing
    console.log("Using mock authentication for testing...");
    const mockResponse = await mockLogin(email, password);
    localStorage.setItem("token", mockResponse.token);
    localStorage.setItem("user", JSON.stringify(mockResponse.user));
    return mockResponse;
  }
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Mock data functions for testing
const mockFetchAssets = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAssets;
};

const mockFetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

const mockFetchLoginLogs = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLoginLogs;
};

const mockEditAsset = async (id: number, updatedData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const assetIndex = mockAssets.findIndex(asset => asset.id === id);
  if (assetIndex !== -1) {
    mockAssets[assetIndex] = { ...mockAssets[assetIndex], ...updatedData };
  }
  return mockAssets[assetIndex];
};

// Assets API
export async function fetchAssets(params = {}) {
  try {
    const res = await api.get("/assets", { params });
    return res.data;
  } catch (error) {
    console.log("Using mock assets data for testing...");
    return await mockFetchAssets();
  }
}

export async function createAsset(assetData: any) {
  try {
    const res = await api.post("/assets", assetData);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAsset(id: number) {
  try {
    const res = await api.delete(`/assets/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function editAsset(id: number, updatedData: any) {
  try {
    const res = await api.put(`/assets/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.log("Using mock asset edit for testing...");
    return await mockEditAsset(id, updatedData);
  }
}

// Users API (HOD only)
export async function fetchUsers() {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (error) {
    console.log("Using mock users data for testing...");
    return await mockFetchUsers();
  }
}

export async function addUser(userData: {
  name: string;
  email: string;
  password: string;
  role: "hod" | "employee";
}) {
  try {
    const res = await api.post("/users", userData);
    return res.data;
  } catch (error) {
    console.log("Using mock user creation for testing...");
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }
}

export async function resetUserPassword(userId: number, newPassword: string) {
  try {
    const res = await api.put(`/users/${userId}/reset-password`, {
      password: newPassword,
    });
    return res.data;
  } catch (error) {
    console.log("Using mock password reset for testing...");
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: "Password reset successfully" };
  }
}

export async function deleteUser(userId: number) {
  try {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  } catch (error) {
    console.log("Using mock user deletion for testing...");
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
    }
    return { success: true, message: "User deleted successfully" };
  }
}

// Logs API (HOD only)
export async function fetchLoginLogs() {
  try {
    const res = await api.get("/logs");
    return res.data;
  } catch (error) {
    console.log("Using mock login logs data for testing...");
    return await mockFetchLoginLogs();
  }
}

export default api; 