# Be Healed

A full-stack application built with Next.js and FastAPI.

## Project Structure

```
be-healed/
├── frontend/         # Next.js frontend application
└── backend/          # FastAPI backend application
```

## Setup Instructions

### Backend Setup
1. Create a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Unix/macOS
   # or
   .\venv\Scripts\activate  # On Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- Modern Next.js frontend with App Router
- FastAPI backend with automatic API documentation
- TypeScript support
- Environment configuration
- CORS configuration
- API integration between frontend and backend 