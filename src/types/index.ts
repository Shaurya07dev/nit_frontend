export interface User {
  id: number;
  name: string;
  email: string;
  role: "hod" | "employee";
  created_at: string;
}

export interface Asset {
  id: number;
  year_of_purchase: number;
  item_name: string;
  quantity: number;
  inventory_number: string;
  room_number: string;
  floor_number: string;
  building_block: string;
  remarks: string;
  department_origin: "own" | "other";
  last_updated: string;
}

export interface LoginLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  login_time: string;
  logout_time: string | null;
  duration_minutes: number | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
} 