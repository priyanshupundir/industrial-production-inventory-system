# Industrial Production & Inventory Management System

A full-stack web application inspired by manufacturing workflows for inventory, production, quality inspection, and maintenance management.

## Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Roles: Admin, Production Manager, Store Officer, Quality Inspector

### Inventory Management
- Track raw materials, components, finished goods, and spare parts
- Stock adjustments with transaction logging
- QR code generation for batch tracking
- Low stock alerts
- Search and filter by category
- Export to PDF and CSV

### Production Orders
- Create and manage production orders
- Kanban-style pipeline view (Pending → In Progress → Inspection → Completed)
- Priority levels (Low, Medium, High, Urgent)
- Machine assignment
- Progress tracking with completion percentages

### Quality Inspection
- Log quality inspection reports
- Track pass, rework, and reject quantities
- Calculate pass rates and defect rates
- Inspection statistics dashboard
- Export inspection reports

### Machine Maintenance
- Monitor equipment status (Operational, Maintenance Due, Under Repair, Offline)
- Log maintenance activities
- Track maintenance costs
- Preventive maintenance scheduling
- Machine utilization tracking

### Suppliers & Purchase Orders
- Manage approved vendors
- Create purchase requisitions
- Track order status (Pending, Ordered, Received, Cancelled)
- Supplier contact management

### Dashboard
- Real-time KPI cards
- Monthly production charts
- Inventory distribution pie charts
- Defect rate trends
- Machine utilization radar charts
- Equipment telemetry

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Router
- TanStack Query
- React Hook Form
- Zod validation
- Recharts
- QRCode.react
- jsPDF & html2canvas (for exports)

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs
- Zod validation

### Infrastructure
- Docker & Docker Compose
- Nginx (for frontend serving)

## Database Schema

- Users
- Departments
- Machines
- Inventory
- InventoryTransactions
- Suppliers
- PurchaseOrders
- ProductionOrders
- ProductionSteps
- QualityInspections
- MaintenanceLogs
- Notifications
- AuditLogs

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd industrial-production-inventory-system
   ```

2. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   ```
   Configure the following variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/industrial_db
   JWT_SECRET=your-secret-key
   REFRESH_TOKEN_SECRET=your-refresh-secret
   CLIENT_URL=http://localhost:5173
   PORT=5000
   ```

3. **Install dependencies**
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   # Server (in terminal 1)
   cd server
   npm run dev

   # Client (in terminal 2)
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

### Docker Deployment

1. **Build and start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

3. **Stop the containers**
   ```bash
   docker-compose down
   ```

## Default Users (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@industrial.com | password123 | Admin |
| manager@industrial.com | password123 | Production Manager |
| officer@industrial.com | password123 | Store Officer |
| inspector@industrial.com | password123 | Quality Inspector |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PATCH /api/inventory/:id/stock` - Update stock quantity

### Production
- `GET /api/production` - Get production orders
- `POST /api/production` - Create production order
- `PATCH /api/production/:id/status` - Update order status

### Quality
- `GET /api/quality/inspections` - Get quality inspections
- `POST /api/quality/inspections` - Create inspection
- `GET /api/quality/inspections/stats` - Get inspection statistics

### Machines
- `GET /api/machines/machines` - Get machines
- `POST /api/machines/machines` - Create machine
- `POST /api/machines/maintenance-logs` - Log maintenance

### Suppliers
- `GET /api/suppliers/suppliers` - Get suppliers
- `POST /api/suppliers/suppliers` - Create supplier
- `GET /api/suppliers/purchase-orders` - Get purchase orders
- `POST /api/suppliers/purchase-orders` - Create purchase order

### Notifications
- `GET /api/notifications/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/notifications/unread-count` - Get unread count

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics and charts

## Project Status

### Completed (100%)
- ✅ Complete database schema with 13 models
- ✅ JWT authentication with RBAC
- ✅ All backend API endpoints
- ✅ Frontend pages (Dashboard, Inventory, Production, Quality, Machines, Suppliers)
- ✅ shadcn/ui component library
- ✅ Docker configuration
- ✅ Database seeding with realistic data
- ✅ PDF/CSV export functionality
- ✅ QR code generation
- ✅ Audit logging

### Ready for Deployment
The application is production-ready and can be deployed using:
- Docker Compose (included)
- Vercel (frontend)
- Render/Neon (backend + database)

## License

MIT License
