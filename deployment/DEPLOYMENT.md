# Epicenter Deployment Configuration

## Backend Deployment (Railway)

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected
- PostgreSQL add-on enabled

### Environment Variables
```
DB_HOST=your_railway_postgres_host
DB_PORT=5432
DB_NAME=epicenter_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Deployment Steps
1. Push code to GitHub branch `main`
2. Connect GitHub repo to Railway
3. Add PostgreSQL plugin
4. Set environment variables
5. Railway will auto-deploy on git push

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected
- Next.js project

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend-railway-domain/api
NEXT_PUBLIC_WS_URL=wss://your-backend-railway-domain
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Deployment Steps
1. Import GitHub repository to Vercel
2. Select Next.js framework
3. Set environment variables
4. Deploy
5. Vercel will auto-deploy on git push

## GitHub Actions CI/CD

See `.github/workflows/` for automated testing and deployment pipelines.

## Database Backup & Recovery

- Automated backups via Railway: Every 24 hours
- Manual backup: `pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup.sql`
- Restore: `psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup.sql`

## Monitoring & Alerts

- Railway: Built-in metrics & logs
- Vercel: Deployment analytics & error tracking
- Application: Winston logs sent to file and console
