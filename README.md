# Car Management System

A full-stack car management application with authentication, categories, and car inventory management.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Redux Toolkit Query, Tailwind CSS
- **Backend**: NestJS with TypeScript, PostgreSQL, Prisma ORM
- **Authentication**: JWT Bearer tokens with persistent login
- **State Management**: Redux Toolkit with RTK Query for API calls

## 📁 Project Structure

```
esqual/
├── esqualbackend/          # NestJS Backend API
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
└── app/                    # Next.js Frontend
    ├── components/
    ├── services/           # RTK Query APIs
    ├── store/             # Redux store
    ├── cars/              # Cars page
    ├── categories/        # Categories page
    ├── login/             # Login page
    ├── register/          # Register page
    └── ...
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Backend Setup (NestJS)

```bash
# Navigate to backend directory
cd esqualbackend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Start the backend server
npm run start:dev
```

The backend will run on **http://localhost:3004**

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory (from project root)
cd app

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on **http://localhost:3000** (or 3001 if 3000 is busy)

## 🔐 Authentication Flow

1. **Register** → Create account with username, email, phone, password
2. **Login** → Get JWT tokens (access + refresh)
3. **Dashboard** → Access Cars and Categories with sidebar navigation
4. **Auto-persistence** → Login state saved to localStorage
5. **Bearer Auth** → All API calls automatically include JWT token

## 📋 Features

### 🚗 Cars Management

- **View all cars** in a professional table layout
- **Add new cars** via modal form (name, year, price, category)
- **Edit existing cars** with pre-filled data
- **Delete cars** with confirmation
- **Category association** with dropdown selection

### 📂 Categories Management

- **View all categories** with car count indicators
- **Add new categories** via modal form (name, description)
- **Edit existing categories** with pre-filled data
- **Delete categories** with confirmation
- **Track cars per category**

### 🎨 UI/UX Features

- **Responsive design** - works on mobile and desktop
- **Professional sidebar** navigation between Cars and Categories
- **Modal-based forms** for better user experience
- **Loading states** and error handling
- **Password visibility toggle** on auth forms
- **Tailwind CSS** for modern styling

## 🔧 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh JWT tokens

### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Cars

- `GET /cars` - Get all cars
- `POST /cars` - Create car
- `PUT /cars/:id` - Update car
- `DELETE /cars/:id` - Delete car

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **RTK Query** - API calls and caching
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling

### Backend

- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Class Validator** - Input validation
- **Swagger** - API documentation

## 🔄 Development Workflow

1. **Start Backend**: `cd esqualbackend && npm run start:dev`
2. **Start Frontend**: `cd app && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Register/Login**: Create account or sign in
5. **Manage Data**: Use sidebar to navigate between Cars and Categories

## 📝 API Data Models

### User Registration

```json
{
  "userName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

### Car Creation

```json
{
  "name": "Toyota Camry",
  "year": 2023,
  "price": 25000,
  "categoryId": "uuid-here"
}
```

### Category Creation

```json
{
  "name": "Sedan",
  "description": "Four-door passenger vehicles"
}
```

## 🔒 Security Features

- **JWT Bearer Authentication** - Secure API access
- **Token persistence** - Login state maintained across sessions
- **Protected routes** - Categories and Cars require authentication
- **Automatic token refresh** - Seamless user experience
- **Input validation** - Server-side validation with Class Validator

## 🎯 User Journey

1. **First Visit** → Redirected to login page
2. **Register** → Create account → Redirected to login
3. **Login** → Get tokens → Redirected to Cars dashboard
4. **Navigation** → Use sidebar to switch between Cars and Categories
5. **CRUD Operations** → Add, edit, delete cars and categories via modals
6. **Logout** → Clear tokens → Return to login page

## 🚨 Troubleshooting

### Common Issues

**Frontend won't connect to backend:**

- Ensure backend is running on port 3004
- Check if `NEXT_PUBLIC_API_URL` environment variable is set

**401 Unauthorized errors:**

- Try logging out and logging back in
- Check if JWT token has expired
- Verify backend authentication is working

**Categories not loading:**

- Check browser console for error details
- Ensure bearer token is being sent with requests
- Verify backend categories endpoint is accessible

## 📦 Dependencies

### Frontend

- `@reduxjs/toolkit` - State management
- `react-redux` - Redux React bindings
- `tailwindcss` - CSS framework
- `next` - React framework

### Backend

- `@nestjs/core` - NestJS framework
- `@prisma/client` - Database client
- `@nestjs/jwt` - JWT authentication
- `class-validator` - Input validation

## 🌟 Features Highlights

- **Professional UI** with sidebar navigation
- **Modal-based forms** for better UX
- **Real-time updates** after CRUD operations
- **Persistent authentication** across browser sessions
- **Responsive design** for all devices
- **Error handling** with user-friendly messages
