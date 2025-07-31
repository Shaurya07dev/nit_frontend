# University Asset Management System

A comprehensive React-based frontend for managing university assets, users, and login activity. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication
- Secure login with email and password
- JWT token-based authentication
- Role-based access control (HOD vs Employee)
- Automatic token refresh and session management

### 📊 Dashboard
- Overview statistics for assets, users, and login activity
- Role-specific quick actions
- Real-time data visualization

### 🏢 Asset Management
- View all university assets in a searchable table
- Edit asset details (quantity, remarks)
- Filter and search functionality
- Export assets to Excel format
- Responsive design with modern UI

### 👥 User Management (HOD Only)
- Add new users with role assignment
- Reset user passwords
- Delete users
- View user activity and permissions

### 📈 Login Activity Logs (HOD Only)
- Monitor user login sessions
- Track login/logout times and duration
- View active vs completed sessions
- Export logs to Excel
- Statistical overview of login activity

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Heroicons
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Table Management**: TanStack React Table
- **Excel Export**: SheetJS (xlsx)
- **Form Handling**: React Hook Form

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('hod', 'employee') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Assets Table
```sql
CREATE TABLE assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year_of_purchase INT,
  item_name VARCHAR(255),
  quantity INT,
  inventory_number VARCHAR(255),
  room_number VARCHAR(100),
  floor_number VARCHAR(100),
  building_block VARCHAR(255),
  remarks TEXT,
  department_origin ENUM('own', 'other') DEFAULT 'own',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Login Logs Table
```sql
CREATE TABLE login_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  login_time DATETIME,
  logout_time DATETIME,
  duration_minutes INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/assets` | Fetch all assets | All |
| PUT | `/api/assets/:id` | Edit asset | All |
| GET | `/api/users` | Fetch all users | HOD |
| POST | `/api/users` | Add new user | HOD |
| PUT | `/api/users/:id/reset-password` | Reset password | HOD |
| DELETE | `/api/users/:id` | Delete user | HOD |
| GET | `/api/logs` | Fetch login logs | HOD |

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Frontend Setup

1. **Clone and install dependencies**
   ```bash
   cd university-asset-management
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Configuration

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── assets/           # Assets management page
│   ├── users/            # User management page (HOD)
│   ├── logs/             # Login logs page (HOD)
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Home page with redirects
├── components/           # Reusable components
│   ├── Layout.tsx        # Main layout with sidebar
│   ├── ProtectedRoute.tsx # Route protection component
│   ├── AssetsTable.tsx   # Assets table with CRUD
│   ├── UsersTable.tsx    # Users table (HOD)
│   └── LogsTable.tsx     # Login logs table (HOD)
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   └── api.ts           # API service functions
└── types/               # TypeScript type definitions
    └── index.ts         # Interface definitions
```

## Usage

### For Employees
1. Login with your email and password
2. View and edit assets in the Assets section
3. Export asset data to Excel if needed
4. Access dashboard for overview statistics

### For HOD (Head of Department)
1. Login with HOD credentials
2. Access all employee features
3. Manage users (add, edit, delete, reset passwords)
4. Monitor login activity and session logs
5. Export user and log data to Excel

## Key Features

### 🔍 Search & Filter
- Global search across all table data
- Real-time filtering
- Sortable columns

### 📊 Data Export
- Excel export for assets, users, and logs
- Formatted data with proper headers
- Automatic file naming

### 🎨 Modern UI/UX
- Clean, professional design
- Responsive layout
- Loading states and error handling
- Intuitive navigation

### 🔒 Security
- JWT token authentication
- Role-based access control
- Protected routes
- Automatic token refresh

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
