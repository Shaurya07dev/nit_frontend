import { User, Asset, LoginLog } from "@/types";

// Mock HOD user
export const mockHODUser: User = {
  id: 1,
  name: "HOD Computer Science",
  email: "hod-csedept@nitpy.ac.in",
  role: "hod",
  created_at: "2024-01-01T00:00:00Z",
};

// Mock employee user
export const mockEmployeeUser: User = {
  id: 2,
  name: "John Doe",
  email: "john.doe@nitpy.ac.in",
  role: "employee",
  created_at: "2024-01-15T00:00:00Z",
};

// Mock assets data
export const mockAssets: Asset[] = [
  {
    id: 1,
    year_of_purchase: 2023,
    item_name: "Dell Latitude Laptop",
    quantity: 25,
    inventory_number: "CS-001",
    room_number: "101",
    floor_number: "1",
    building_block: "Computer Science Block",
    remarks: "For faculty use",
    department_origin: "own",
    last_updated: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    year_of_purchase: 2022,
    item_name: "HP Desktop Computer",
    quantity: 50,
    inventory_number: "CS-002",
    room_number: "102",
    floor_number: "1",
    building_block: "Computer Science Block",
    remarks: "For lab use",
    department_origin: "own",
    last_updated: "2024-01-18T14:20:00Z",
  },
  {
    id: 3,
    year_of_purchase: 2023,
    item_name: "Projector",
    quantity: 8,
    inventory_number: "CS-003",
    room_number: "201",
    floor_number: "2",
    building_block: "Computer Science Block",
    remarks: "For classroom presentations",
    department_origin: "own",
    last_updated: "2024-01-19T09:15:00Z",
  },
  {
    id: 4,
    year_of_purchase: 2021,
    item_name: "Network Switch",
    quantity: 12,
    inventory_number: "CS-004",
    room_number: "Server Room",
    floor_number: "1",
    building_block: "Computer Science Block",
    remarks: "24-port managed switches",
    department_origin: "other",
    last_updated: "2024-01-17T16:45:00Z",
  },
  {
    id: 5,
    year_of_purchase: 2023,
    item_name: "Printer",
    quantity: 6,
    inventory_number: "CS-005",
    room_number: "103",
    floor_number: "1",
    building_block: "Computer Science Block",
    remarks: "Laser printers for department use",
    department_origin: "own",
    last_updated: "2024-01-16T11:30:00Z",
  },
];

// Mock users data
export const mockUsers: User[] = [
  mockHODUser,
  mockEmployeeUser,
  {
    id: 3,
    name: "Jane Smith",
    email: "jane.smith@nitpy.ac.in",
    role: "employee",
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike.johnson@nitpy.ac.in",
    role: "employee",
    created_at: "2024-01-25T00:00:00Z",
  },
];

// Mock login logs data
export const mockLoginLogs: LoginLog[] = [
  {
    id: 1,
    user_id: 1,
    user_name: "HOD Computer Science",
    user_email: "hod-csedept@nitpy.ac.in",
    login_time: "2024-01-31T08:00:00Z",
    logout_time: "2024-01-31T17:30:00Z",
    duration_minutes: 570,
  },
  {
    id: 2,
    user_id: 2,
    user_name: "John Doe",
    user_email: "john.doe@nitpy.ac.in",
    login_time: "2024-01-31T09:15:00Z",
    logout_time: "2024-01-31T16:45:00Z",
    duration_minutes: 450,
  },
  {
    id: 3,
    user_id: 3,
    user_name: "Jane Smith",
    user_email: "jane.smith@nitpy.ac.in",
    login_time: "2024-01-31T08:30:00Z",
    logout_time: null,
    duration_minutes: null,
  },
  {
    id: 4,
    user_id: 1,
    user_name: "HOD Computer Science",
    user_email: "hod-csedept@nitpy.ac.in",
    login_time: "2024-01-30T08:00:00Z",
    logout_time: "2024-01-30T18:00:00Z",
    duration_minutes: 600,
  },
  {
    id: 5,
    user_id: 2,
    user_name: "John Doe",
    user_email: "john.doe@nitpy.ac.in",
    login_time: "2024-01-30T09:00:00Z",
    logout_time: "2024-01-30T17:00:00Z",
    duration_minutes: 480,
  },
]; 