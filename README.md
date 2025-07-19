# Claynova Charm - Full Stack E-commerce Platform

A modern e-commerce platform for handcrafted ceramics and artisanal products, built with React and FastAPI.

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend applications:

```
claynova-charm-web/
├── frontend/          # React + Vite frontend application
├── backend/           # FastAPI backend application  
├── shared/            # Shared types and utilities
├── docker-compose.yml # Local development setup
└── README.md          # This file
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Start both frontend and backend
docker-compose up

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

## 📁 Frontend (React + Vite)

Located in `/frontend` directory:
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React hooks
- **HTTP Client**: Built-in fetch

**Key Features:**
- Responsive design
- Product catalog and details
- Shopping cart functionality
- Modern UI components
- SEO optimized

## 🔧 Backend (FastAPI)

Located in `/backend` directory:
- **Framework**: FastAPI with Python 3.11+
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens
- **API Docs**: Auto-generated with OpenAPI/Swagger

**Key Features:**
- RESTful API design
- Automatic API documentation
- CORS enabled for frontend
- Pydantic data validation
- Async/await support

### API Endpoints

- `GET /` - API root
- `GET /health` - Health check
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/featured` - Featured products
- `GET /api/v1/products/{id}` - Get specific product

## 🛠️ Development

### Project Scripts

**Root level:**
```bash
# Start entire stack
docker-compose up

# Stop stack
docker-compose down
```

**Frontend:**
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

**Backend:**
```bash
cd backend
uvicorn main:app --reload  # Development server
pytest                     # Run tests
```

## 🌐 Environment Configuration

### Backend Environment Variables
Create `backend/.env`:
```
PROJECT_NAME=Claynova Charm API
DATABASE_URL=sqlite:///./claynova.db
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables  
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

## 📦 Dependencies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
- Alembic
- Python-jose
- Passlib

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`.

### Backend (Railway/Heroku/AWS)
The backend includes a Dockerfile for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
