# Epicenter Architecture

## System Overview

Epicenter is a three-tier web application for real-time disease outbreak surveillance:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Vercel)                   │
│  Next.js + React + Leaflet + WebSocket                      │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTPS/WSS)
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Railway)                │
│  Node.js + Express API Server                               │
│  - REST Endpoints                                           │
│  - WebSocket Server                                         │
│  - JWT Authentication                                       │
│  - Business Logic                                           │
└─────────────────────────────────────────────────────────────┘
                            ↕ (TCP)
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer (Railway)                   │
│  PostgreSQL + PostGIS                                       │
│  - Geospatial Data                                          │
│  - Audit Logs                                               │
│  - User Management                                          │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Backend Services

#### 1. **Authentication Service**
- User registration and login
- JWT token generation and validation
- Device authentication
- Role-based access control (RBAC)

#### 2. **Outbreak Service**
- Receive and validate outbreak data
- Assign county based on GPS coordinates
- Detect duplicate reports
- Real-time WebSocket broadcasting
- Device health monitoring

#### 3. **Geospatial Service**
- PostGIS queries for location-based analysis
- County boundary querying
- Heatmap data generation
- Clustering of nearby outbreaks
- Trend analysis by location

#### 4. **Analytics Service**
- Dashboard statistics
- Trend line generation
- Basic forecasting
- County-level reporting
- Outbreak distribution analysis

#### 5. **Admin Service**
- Audit log retrieval
- Duplicate tracking
- Device management
- User management
- System health monitoring

### Frontend Components

#### Pages
- **index.jsx**: Landing page
- **login.jsx**: User authentication
- **register.jsx**: User registration
- **dashboard.jsx**: Main monitoring dashboard
- **admin.jsx**: Administration panel

#### Components
- **OutbreakMap.jsx**: Interactive Leaflet map with markers and heatmap
- **TrendChart.jsx**: Chart visualization using Recharts
- **StatsDashboard.jsx**: Key statistics widgets
- **FilterBar.jsx**: Date, pathogen, and location filtering

### State Management (Zustand)
- `useAuthStore`: Authentication state
- `useFilterStore`: Dashboard filters
- `useMapStore`: Map visualization settings

## Data Flow

### Outbreak Submission Flow
1. Device sends JSON data to `/api/outbreak/uploadResult` with device token
2. Backend validates pathogen name, GPS coordinates, and timestamp
3. PostGIS assigns county based on coordinates
4. Outbreak record created in database
5. Duplicate detection algorithm runs asynchronously
6. Audit log entry created
7. WebSocket broadcasts to all connected clients
8. Frontend updates map in real-time

### Analytics Flow
1. Frontend requests dashboard data from `/api/analytics/dashboard`
2. Backend aggregates statistics from outbreaks table
3. PostGIS queries for geospatial statistics
4. Data returned as JSON
5. Frontend renders charts and statistics

### Duplicate Detection Flow
1. New outbreak created
2. Asynchronous process queries similar outbreaks (within 30 min, 1km)
3. Similarity scored based on: pathogen match, result match, spatial proximity, temporal proximity
4. Matches above 95% threshold marked as duplicates
5. Original outbreak linked in duplicate tracking table
6. Duplicate outbreak marked with `is_duplicate = TRUE`

## Security Architecture

### Authentication & Authorization
- JWT tokens with 7-day expiration
- Role-based access control (operator, health_official, admin)
- Device tokens for IoT devices
- Password hashing with bcryptjs

### Data Protection
- HTTPS/TLS for all communication
- WSS (WebSocket Secure) for real-time updates
- Database SSL connections
- Parameterized queries to prevent SQL injection

### Audit & Compliance
- Complete audit trail of all submissions
- Device ID and timestamp logging
- User action tracking
- Duplicate detection transparency

## Scalability Considerations

### Database
- PostGIS indexes on location and timestamp
- Connection pooling (max 20 connections)
- Geospatial indexing for fast queries
- Partitioning strategy for large datasets

### API Server
- Horizontal scaling via Railway
- Load balancing
- Asynchronous duplicate detection
- WebSocket for efficient real-time updates
- Redis caching (optional)

### Frontend
- Static site generation (SSG) via Next.js
- Image optimization
- Code splitting
- PWA support for offline functionality

## Deployment Strategy

### Environments
- **Development**: Local Docker Compose
- **Staging**: Railway development branch
- **Production**: Railway main branch + Vercel main branch

### CI/CD Pipeline
1. Developer pushes to feature branch
2. GitHub Actions runs tests and linters
3. Pull request created and reviewed
4. Merge to develop triggers staging deployment
5. Merge to main triggers production deployment
6. Automatic health checks and monitoring

### Monitoring & Logging
- Application logs via Winston
- Error tracking via Vercel/Railway
- Database query monitoring
- WebSocket connection monitoring
- Request latency tracking

## Performance Optimization

### Database
- Indexes on frequently queried columns
- Geospatial indexes with GIST
- Query optimization
- Connection pooling

### API
- Response compression
- Request caching headers
- Lazy loading of related data
- Pagination for large datasets

### Frontend
- Code splitting
- Image lazy loading
- CSS minification
- PWA caching strategy

## Disaster Recovery

### Backup Strategy
- Daily automated PostgreSQL backups on Railway
- Point-in-time recovery capability
- Backup retention: 30 days

### Recovery Procedures
- Database restoration from backup
- Frontend redeployment from Git
- Backend redeployment from Git
- Zero-downtime deployment

## Future Enhancements

1. **Message Queue**: RabbitMQ/Kafka for high-traffic handling
2. **Machine Learning**: Advanced forecasting models
3. **Mobile Apps**: Native iOS/Android applications
4. **SMS/Email**: Automated notifications for critical outbreaks
5. **Multi-country**: Support for other African nations
6. **Integration**: APIs for integration with national health systems
