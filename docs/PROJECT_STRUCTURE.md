# Project Structure

## Directory Layout

```
aptuguard_backend1/
├── .github/
│   └── workflows/
│       ├── backend.yml              # Backend CI/CD pipeline
│       └── frontend.yml             # Frontend CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── outbreakController.js
│   │   │   ├── analyticsController.js
│   │   │   └── adminController.js
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── outbreak.js
│   │   │   ├── analytics.js
│   │   │   └── admin.js
│   │   ├── services/                # Business logic
│   │   │   ├── duplicateService.js
│   │   │   └── geospatialService.js
│   │   ├── utils/                   # Utilities
│   │   │   ├── database.js
│   │   │   ├── logger.js
│   │   │   ├── validation.js
│   │   │   └── websocket.js
│   │   └── index.js                 # Entry point
│   ├── migrations/                  # Database migrations
│   ├── package.json
│   ├── .env.example
│   └── logs/
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Next.js pages
│   │   │   ├── index.jsx            # Landing page
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── dashboard.jsx        # Main dashboard
│   │   │   └── admin.jsx            # Admin panel
│   │   ├── components/              # React components
│   │   │   ├── OutbreakMap.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── StatsDashboard.jsx
│   │   │   └── FilterBar.jsx
│   │   ├── services/                # API client
│   │   │   └── api.js
│   │   ├── hooks/                   # React hooks
│   │   │   └── useWebSocket.js
│   │   ├── utils/                   # Utilities
│   │   │   └── store.js             # Zustand state management
│   │   ├── styles/                  # CSS
│   │   │   └── globals.css
│   │   └── _document.js             # Next.js document
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── deployment/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml           # Local dev environment
│   ├── railway.toml                 # Railway config
│   ├── setup-local.bat              # Windows setup script
│   ├── setup-local.sh               # Linux/Mac setup script
│   └── DEPLOYMENT.md                # Deployment guide
├── docs/
│   ├── ARCHITECTURE.md              # System architecture
│   ├── API.md                       # API documentation
│   ├── GITHUB_SETUP.md              # GitHub setup guide
│   └── PROJECT_STRUCTURE.md         # This file
├── README.md                        # Main readme
└── .gitignore
```

## File Descriptions

### Backend Files

| File | Purpose |
|------|---------|
| `src/index.js` | Express server entry point, WebSocket setup |
| `src/utils/database.js` | PostgreSQL connection, schema creation |
| `src/utils/logger.js` | Winston logging configuration |
| `src/utils/validation.js` | Request validation schemas |
| `src/utils/websocket.js` | WebSocket event handling |
| `src/middleware/auth.js` | JWT authentication middleware |
| `src/middleware/errorHandler.js` | Global error handler |
| `src/controllers/authController.js` | User registration & login logic |
| `src/controllers/outbreakController.js` | Outbreak submission handling |
| `src/controllers/analyticsController.js` | Analytics data generation |
| `src/controllers/adminController.js` | Admin functions |
| `src/services/duplicateService.js` | Duplicate detection & merging |
| `src/services/geospatialService.js` | PostGIS queries |
| `src/routes/*.js` | API endpoint definitions |

### Frontend Files

| File | Purpose |
|------|---------|
| `src/pages/index.jsx` | Landing page |
| `src/pages/login.jsx` | User login form |
| `src/pages/register.jsx` | User registration form |
| `src/pages/dashboard.jsx` | Main monitoring dashboard |
| `src/pages/admin.jsx` | Administration panel |
| `src/components/OutbreakMap.jsx` | Leaflet map visualization |
| `src/components/TrendChart.jsx` | Recharts trend visualization |
| `src/components/StatsDashboard.jsx` | Statistics display |
| `src/components/FilterBar.jsx` | Filter controls |
| `src/services/api.js` | Axios API client |
| `src/hooks/useWebSocket.js` | WebSocket connection hook |
| `src/utils/store.js` | Zustand state stores |

## Key Technologies

### Backend
- **Node.js 18**: JavaScript runtime
- **Express**: Web framework
- **PostgreSQL + PostGIS**: Geospatial database
- **JWT**: Authentication
- **WebSocket (ws)**: Real-time updates
- **Winston**: Logging
- **bcryptjs**: Password hashing
- **Joi**: Input validation

### Frontend
- **Next.js 14**: React framework
- **React 18**: UI library
- **Leaflet**: Map visualization
- **Recharts**: Data visualization
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Axios**: HTTP client
- **next-pwa**: Progressive Web App

### Infrastructure
- **Railway**: Backend hosting
- **Vercel**: Frontend hosting
- **GitHub Actions**: CI/CD
- **Docker Compose**: Local development

## Development Guidelines

### Backend
- Use `npm run dev` for development with nodemon
- Validate all inputs with Joi schemas
- Use async/await for async operations
- Implement proper error handling
- Add audit logs for important actions
- Use database transactions for multi-step operations

### Frontend
- Use functional components with hooks
- Store global state in Zustand stores
- Use React.memo for expensive components
- Implement error boundaries
- Add proper loading and error states
- Use Next.js Image for image optimization

### Database
- Use PostGIS for geospatial queries
- Create indexes for frequently queried columns
- Use transactions for critical operations
- Include audit columns (created_at, updated_at)
- Document schema changes

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm run lint
npm run build  # Test production build
```

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates valid
- [ ] Error tracking configured
- [ ] Logging configured
- [ ] Backups configured
- [ ] Monitoring configured
- [ ] CI/CD pipeline working

---

See individual files for more detailed documentation.
