# Getting Started with Epicenter

## ✅ Complete Checklist for First-Time Setup

### 1. Prerequisites Installation
- [ ] Node.js 18+ (https://nodejs.org/)
- [ ] Docker Desktop (https://www.docker.com/products/docker-desktop)
- [ ] Git (https://git-scm.com/)
- [ ] Mapbox Account (https://www.mapbox.com/)
- [ ] Railway Account (https://railway.app)
- [ ] Vercel Account (https://vercel.com)
- [ ] GitHub Account: nicolewafula1-sudo

### 2. Local Development Setup

#### Option A: Docker Compose (Recommended)

**Windows:**
```bash
cd c:\Users\user\OneDrive\Desktop\aptuguard_backend1
deployment\setup-local.bat
```

**macOS/Linux:**
```bash
cd ~/aptuguard_backend1
chmod +x deployment/setup-local.sh
./deployment/setup-local.sh
```

#### Option B: Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

**Frontend (in new terminal):**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 3. Accessing Local Services

After startup, open in browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

### 4. First Test Account

Use these credentials to test:
```
Username: testuser
Password: TestPassword123!
Email: test@epicenter.health
Role: operator
```

Or register a new account at: http://localhost:3000/register

### 5. GitHub Repository Setup

```bash
cd c:\Users\user\OneDrive\Desktop\aptuguard_backend1

# Configure git
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add GitHub remote
git remote add origin git@github.com:nicolewafula1-sudo/epicenter.git

# Create and push to GitHub
git branch -M main
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

See [GitHub Setup Guide](GITHUB_SETUP.md) for detailed instructions.

### 6. Production Deployment

#### Deploy Backend to Railway
1. Go to https://railway.app
2. Create new project
3. Connect GitHub repository: nicolewafula1-sudo/epicenter
4. Add PostgreSQL plugin
5. Configure environment variables (see [Deployment Guide](DEPLOYMENT.md))
6. Railway auto-deploys on `git push origin main`

#### Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import Project from GitHub: nicolewafula1-sudo/epicenter
3. Select framework: Next.js
4. Set root directory: frontend
5. Configure environment variables
6. Vercel auto-deploys on `git push origin main`

### 7. Project Structure

```
aptuguard_backend1/
├── backend/          # Node.js + Express
├── frontend/         # Next.js + React
├── deployment/       # Docker & deployment configs
├── docs/             # Documentation
└── .github/
    └── workflows/    # CI/CD pipelines
```

For detailed structure, see [Project Structure Guide](PROJECT_STRUCTURE.md)

### 8. Common Commands

**Start Local Development:**
```bash
# Using Docker Compose
docker-compose -f deployment/docker-compose.yml up -d

# View logs
docker-compose -f deployment/docker-compose.yml logs -f
```

**Backend Development:**
```bash
cd backend
npm run dev          # Start with nodemon
npm test             # Run tests
npm run lint         # Lint code
```

**Frontend Development:**
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Lint code
```

**Git Operations:**
```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub UI
```

### 9. Key Files to Configure

1. **Backend Configuration**
   - `backend/.env` - Copy from `.env.example`
   - `backend/src/index.js` - Server configuration
   - `backend/src/utils/validation.js` - Pathogen/county lists

2. **Frontend Configuration**
   - `frontend/.env.local` - Copy from `.env.example`
   - `frontend/next.config.js` - Next.js config
   - `frontend/tailwind.config.js` - Styling

3. **Deployment Configuration**
   - `deployment/docker-compose.yml` - Local dev environment
   - `.github/workflows/backend.yml` - Backend CI/CD
   - `.github/workflows/frontend.yml` - Frontend CI/CD

### 10. Verification Checklist

After setup, verify:
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:3001/health
- [ ] Can register new user
- [ ] Can login with registered account
- [ ] Dashboard loads and displays map
- [ ] Admin panel accessible for admin users
- [ ] Docker containers running without errors
- [ ] Git repository initialized with commits
- [ ] GitHub remote configured correctly
- [ ] Environment variables set correctly

### 11. Database Verification

Connect to local database:
```bash
# Get database credentials from docker-compose.yml
# Default: postgres/postgres on localhost:5432

# Using psql (if installed)
psql -h localhost -U epicenter_user -d epicenter_db

# Using Docker
docker-compose -f deployment/docker-compose.yml exec postgres psql -U epicenter_user -d epicenter_db

# Check tables
\dt                 # List all tables
SELECT * FROM users;  # Query users table
```

### 12. Next Steps

1. **Explore the codebase**
   - Read [Architecture Guide](ARCHITECTURE.md)
   - Check [API Documentation](API.md)
   - Review backend controllers and routes

2. **Make changes**
   - Create feature branches
   - Implement new features
   - Test thoroughly

3. **Deploy to production**
   - Push to GitHub `main` branch
   - GitHub Actions runs tests
   - Railway and Vercel auto-deploy
   - Monitor logs on respective dashboards

4. **Monitor and maintain**
   - Check logs regularly
   - Monitor performance
   - Update dependencies
   - Scale as needed

## 🆘 Troubleshooting

### Docker Issues
```bash
# Rebuild containers
docker-compose -f deployment/docker-compose.yml down -v
docker-compose -f deployment/docker-compose.yml up -d --build

# Check logs
docker-compose -f deployment/docker-compose.yml logs -f backend
```

### Database Connection Issues
```bash
# Verify PostgreSQL is running
docker-compose -f deployment/docker-compose.yml ps

# Check database logs
docker-compose -f deployment/docker-compose.yml logs postgres
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Git Issues
```bash
# Check remote
git remote -v

# Update remote URL
git remote set-url origin git@github.com:nicolewafula1-sudo/epicenter.git

# Test SSH connection
ssh -T git@github.com
```

## 📚 Documentation Links

- [README](../README.md) - Project overview
- [Architecture Guide](ARCHITECTURE.md) - System design
- [API Documentation](API.md) - API endpoints
- [GitHub Setup](GITHUB_SETUP.md) - GitHub configuration
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Project Structure](PROJECT_STRUCTURE.md) - Code organization

## 💡 Tips & Tricks

1. **Use VS Code extensions**
   - ESLint
   - Prettier
   - GitLens
   - PostGIS

2. **Database backup**
   ```bash
   docker-compose -f deployment/docker-compose.yml exec postgres \
     pg_dump -U epicenter_user epicenter_db > backup.sql
   ```

3. **Reset database**
   ```bash
   docker-compose -f deployment/docker-compose.yml down -v
   docker-compose -f deployment/docker-compose.yml up -d
   ```

4. **View real-time logs**
   ```bash
   docker-compose -f deployment/docker-compose.yml logs -f
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   ```

---

**Ready to start? Begin with Prerequisites Installation ✅**

Need help? Check the troubleshooting section or consult the documentation files.
