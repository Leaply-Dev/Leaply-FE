# Local Development Guide

This guide covers setting up both the **Frontend** (Next.js) and **Backend** (Spring Boot) for local development.

---

## Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 18+ | `node -v` |
| Bun (recommended) | 1.3+ | `bun -v` |
| Docker & Docker Compose | - | `docker --version` |
| Java (for BE) | 21+ | `java -version` |

---

## Quick Start (TL;DR)

```bash
# Terminal 1 - Backend
cd ~/Code/Leaply/Leaply-BE
cp .env.example .env
# Edit .env to set CORS_ALLOWED_ORIGINS=http://localhost:3000
docker compose -f docker-compose.dev.yml up -d  # Start DB
./mvnw spring-boot:run                          # Start API

# Terminal 2 - Frontend
cd ~/Code/Leaply/Leaply-FE
cp .env.example .env.local
bun install                                     # or: npm install
bun dev                                         # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Frontend Setup

### 1. Environment Configuration

```bash
cd ~/Code/Leaply/Leaply-FE
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# API Configuration (points to local backend)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Feature Flags
NEXT_PUBLIC_USE_MOCK_DATA=false
```

**Environment Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080/api` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Use mock data instead of API | `false` |

### 2. Install Dependencies

```bash
# Preferred (faster)
bun install

# Alternative
npm install
```

### 3. Start Development Server

```bash
# Preferred
bun dev

# Alternative
npm run dev
```

Frontend runs at: [http://localhost:3000](http://localhost:3000)

### 4. Available Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun check` | Lint + format (Biome) |
| `bun knip` | Find dead code |

---

## Backend Setup

### 1. Environment Configuration

```bash
cd ~/Code/Leaply/Leaply-BE
cp .env.example .env
```

Edit `.env`:

```bash
# Database Configuration
POSTGRES_DB=leaply
POSTGRES_USER=leaply
POSTGRES_PASSWORD=leaply123
POSTGRES_PORT=5432

# App Configuration
JWT_SECRET=815e939a98cf4e830b56c1dd7dd66a0cfa2dd501ab937169055b6ba704e3f082
OPENAI_API_KEY=your_openai_api_key

# CORS - IMPORTANT for local development
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 2. Start Database (Docker)

```bash
# Start PostgreSQL only (for local development)
docker compose -f docker-compose.dev.yml up -d

# Verify it's running
docker compose ps
```

### 3. Start Application

**Option A: Maven (Recommended for development)**

```bash
# Load environment variables
export $(grep -v '^#' .env | xargs)

# Run application
./mvnw spring-boot:run
```

**Option B: IntelliJ IDEA**

1. Open project in IntelliJ
2. Go to Run → Edit Configurations
3. Add `.env` file to Environment Variables
4. Run the application

Backend runs at: [http://localhost:8080/api](http://localhost:8080/api)

### 4. Verify Backend

```bash
# Health check
curl http://localhost:8080/api/actuator/health

# Should return: {"status":"UP"}
```

### 5. API Documentation

Swagger UI: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)

---

## CORS Configuration

CORS is configured in the backend via the `CORS_ALLOWED_ORIGINS` environment variable.

### For Local Development

```bash
# In .env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### For Multiple Origins

```bash
# Comma-separated list
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### How It Works

The backend (`SecurityConfig.java`) reads `CORS_ALLOWED_ORIGINS` and:
- Allows all methods: `GET, POST, PATCH, PUT, DELETE, OPTIONS`
- Allows all headers
- Allows credentials (cookies)
- Applies to all endpoints (`/**`)

### Troubleshooting CORS

If you see CORS errors:

1. **Check backend is running**: `curl http://localhost:8080/api/actuator/health`
2. **Verify CORS config**: Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
3. **Restart backend** after changing `.env`
4. **Check browser console** for specific CORS error messages

---

## Running Both Together

### Step 1: Start Backend First

```bash
cd ~/Code/Leaply/Leaply-BE
docker compose -f docker-compose.dev.yml up -d  # Database
./mvnw spring-boot:run                          # Application
```

### Step 2: Start Frontend

```bash
cd ~/Code/Leaply/Leaply-FE
bun dev
```

### Step 3: Verify Connection

1. Open [http://localhost:3000](http://localhost:3000)
2. Try to log in or access a protected page
3. Check browser Network tab for API calls to `localhost:8080`

---

## Mock Data Mode

If you need to work on frontend without the backend:

```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
```

This enables mock data for:
- University listings
- User profiles
- Applications
- Persona Lab (partial)

---

## Common Issues

### Issue: "CORS error" in browser

**Solution**: Ensure backend `.env` has:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000
```
Then restart the backend.

### Issue: "Connection refused" to API

**Solution**:
1. Check backend is running: `curl http://localhost:8080/api/actuator/health`
2. Check Docker DB is running: `docker compose ps`

### Issue: Database connection error in backend

**Solution**:
1. Start the database: `docker compose -f docker-compose.dev.yml up -d`
2. Wait a few seconds for it to initialize
3. Restart the backend

### Issue: Frontend shows "Loading..." forever

**Solution**:
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Enable mock data mode if backend is unavailable

---

## Development Workflow

### Daily Workflow

```bash
# Start backend (Terminal 1)
cd ~/Code/Leaply/Leaply-BE
docker compose -f docker-compose.dev.yml up -d
./mvnw spring-boot:run

# Start frontend (Terminal 2)
cd ~/Code/Leaply/Leaply-FE
bun dev
```

### Before Committing (Frontend)

```bash
bun check     # Lint and format
bun build     # Verify build passes
bun knip      # Check for dead code
```

### Stopping Services

```bash
# Stop frontend: Ctrl+C

# Stop backend: Ctrl+C

# Stop database
cd ~/Code/Leaply/Leaply-BE
docker compose down
```

---

## Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 8080 | http://localhost:8080/api |
| PostgreSQL | 5432 | `localhost:5432` |
| Swagger UI | 8080 | http://localhost:8080/api/swagger-ui.html |

---

## Additional Resources

- **Backend README**: `/home/keishi/Code/Leaply/Leaply-BE/README.md`
- **Backend Setup (VPS)**: `/home/keishi/Code/Leaply/Leaply-BE/SETUP.md`
- **Frontend CLAUDE.md**: Instructions for Claude Code assistant
- **Persona Lab API**: `/home/keishi/Code/Leaply/Leaply-BE/docs/PERSONA_LAB_API.md`
