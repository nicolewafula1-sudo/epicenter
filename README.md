# Epicenter - Outbreak Mapping Software

A comprehensive, real-time outbreak mapping and monitoring system for disease surveillance across Kenya.

## 🌟 Features

### Backend
- **Real-time Outbreak Tracking**: REST API endpoints for receiving and processing disease outbreak data
- **Geospatial Analysis**: PostgreSQL + PostGIS for location-based querying and analysis
- **JWT Authentication**: Secure token-based authentication for devices and users
- **Duplicate Detection**: Intelligent algorithm to identify and merge duplicate outbreak reports
- **Audit Logging**: Complete audit trail of all outbreak submissions and data modifications
- **Device Health Monitoring**: Track battery level and connectivity status of reporting devices
- **Multi-device Support**: Handle concurrent submissions from thousands of devices without conflicts
- **WebSocket Real-time Updates**: Live streaming of new outbreak data to connected clients
- **Role-Based Access Control**: Support for device operators, health officials, and administrators
- **Data Validation**: Comprehensive validation of pathogen names, GPS coordinates, and timestamps
- **County Assignment**: Automatic geospatial assignment of outbreak reports to Kenya counties

### Frontend
- **Interactive Map**: Leaflet-based mapping with Mapbox tiles
- **Outbreak Visualization**: Markers, clusters, and heatmap visualizations
- **Real-time Updates**: WebSocket integration for live data streaming
- **Analytics Dashboard**: Statistics, trends, and forecasting
- **Advanced Filtering**: Filter by pathogen, date range, location, and confidence score
- **Admin Panel**: Audit logs, duplicate tracking, device management
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Offline Caching**: PWA support for offline functionality

### Deployment
- **Railway**: Node.js + PostgreSQL backend deployment
- **Vercel**: Next.js frontend deployment
- **CI/CD**: GitHub Actions workflows for automated testing and deployment
- **Docker Compose**: Local development environment setup
- **Monitoring**: Built-in logging and error tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git
- PostgreSQL (or use Docker)

### Local Development

1. **Clone the repository**
```bash
cd aptuguard_backend1
```

2. **Setup with Docker Compose** (Recommended)

   **On Windows:**
   ```bash
   deployment\setup-local.bat
   ```

   **On macOS/Linux:**
   ```bash
   chmod +x deployment/setup-local.sh
   ./deployment/setup-local.sh
   ```

3. **Access services**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Database: localhost:5432

### Manual Setup (Without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 📝 Configuration

### Backend Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=epicenter_db
DB_USER=epicenter_user
DB_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/device/register` - Register device

### Outbreaks
- `POST /api/outbreak/uploadResult` - Submit outbreak data
- `GET /api/outbreak/recent` - Get recent outbreaks
- `GET /api/outbreak/:id` - Get outbreak details

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/heatmap` - Heatmap data
- `GET /api/analytics/clusters` - Clustered outbreaks
- `GET /api/analytics/trend/:pathogen` - Trend data
- `GET /api/analytics/counties` - County statistics

### Admin
- `GET /api/admin/audit-logs` - Audit log entries
- `GET /api/admin/duplicates` - Duplicate report
- `GET /api/admin/devices` - Device report
- `GET /api/admin/health` - System health

## 🧪 Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## 🐳 Docker Commands

```bash
# Build images
docker-compose -f deployment/docker-compose.yml build

# Start services
docker-compose -f deployment/docker-compose.yml up -d

# View logs
docker-compose -f deployment/docker-compose.yml logs -f

# Stop services
docker-compose -f deployment/docker-compose.yml down

# Database shell
docker-compose -f deployment/docker-compose.yml exec postgres psql -U epicenter_user -d epicenter_db
```

## 🚢 Production Deployment

### Railway Deployment (Backend)
1. Create Railway account at https://railway.app
2. Connect GitHub repository
3. Add PostgreSQL plugin
4. Set environment variables
5. Railway auto-deploys on git push to main

### Vercel Deployment (Frontend)
1. Create Vercel account at https://vercel.com
2. Import GitHub repository
3. Set environment variables
4. Vercel auto-deploys on git push to main

See [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md) for detailed instructions.

## 🔐 Security Features

- **HTTPS/TLS**: Encrypted data in transit
- **JWT Authentication**: Token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **RBAC**: Role-based access control
- **Input Validation**: Comprehensive input sanitization
- **Audit Logging**: Complete audit trail
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured CORS headers

## 📊 Database Schema

- `users` - User accounts and roles
- `devices` - Registered devices for outbreak reporting
- `outbreaks` - Outbreak reports with geospatial data
- `audit_logs` - Complete audit trail
- `duplicate_tracking` - Duplicate detection records
- `pathogen_whitelist` - Valid pathogen names
- `kenya_counties` - Kenya county boundaries (PostGIS)

## 🔄 WebSocket Events

- `outbreak_update` - New outbreak data received
- `map_refresh` - Map data update notification
- `system_alert` - System-level alerts

## 📚 Documentation

- [API Documentation](docs/API.md) - Detailed API endpoints
- [Deployment Guide](deployment/DEPLOYMENT.md) - Production deployment
- [Architecture](docs/ARCHITECTURE.md) - System architecture
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

## 📦 Tech Stack

**Backend:**
- Node.js with Express
- PostgreSQL with PostGIS
- JWT Authentication
- WebSocket (ws)
- Winston Logging

**Frontend:**
- Next.js 14
- React 18
- Leaflet with Mapbox
- Recharts
- Tailwind CSS
- Zustand State Management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 License

This project is proprietary software developed for outbreak surveillance. All rights reserved.

## 👥 Support

For support, issues, or questions:
- Email: support@epicenter.health
- GitHub Issues: https://github.com/nicolewafula1-sudo/epicenter/issues

## 🔮 Roadmap

- [ ] Mobile app for iOS/Android
- [ ] SMS/Email notifications for critical outbreaks
- [ ] Advanced AI forecasting models
- [ ] Integration with national health systems
- [ ] Multi-country support
- [ ] Offline data sync for remote areas
- [ ] Integration with other surveillance systems

---

**Built with ❤️ for public health**
