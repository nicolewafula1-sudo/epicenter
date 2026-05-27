# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://epicenter-backend.railway.app/api`

## Authentication

All endpoints (except `/health` and auth endpoints) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Device endpoints require a device token in the `x-device-token` header:

```
x-device-token: <device_token>
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": {}
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Endpoints

### Authentication Endpoints

#### Register User
```
POST /auth/register
```

Request:
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string (min 8 chars)",
  "role": "operator|health_official|admin"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "string",
    "email": "user@example.com",
    "role": "operator"
  },
  "token": "jwt_token"
}
```

#### Login
```
POST /auth/login
```

Request:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "string",
    "role": "operator"
  },
  "token": "jwt_token"
}
```

#### Register Device
```
POST /auth/device/register
Authorization: Bearer <jwt_token>
```

Request:
```json
{
  "device_id": "string",
  "device_name": "string",
  "device_type": "string"
}
```

Response:
```json
{
  "success": true,
  "device": {
    "id": "string",
    "user_id": 1,
    "device_name": "string",
    "device_type": "string"
  },
  "deviceToken": "jwt_token"
}
```

### Outbreak Endpoints

#### Upload Outbreak Result
```
POST /outbreak/uploadResult
x-device-token: <device_token>
```

Request:
```json
{
  "device_id": "string",
  "pathogen": "E.coli|Salmonella|Cholera|...",
  "result": "positive|negative",
  "timestamp": "2024-01-15T10:30:00Z",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "sample_type": "string (optional)",
  "confidence_score": 0.95,
  "battery_level": 85,
  "connectivity_status": "strong"
}
```

Response:
```json
{
  "success": true,
  "outbreak": {
    "id": 123,
    "pathogen": "E.coli",
    "county": "Nairobi",
    "timestamp": "2024-01-15T10:30:00Z",
    "device_id": "device-001"
  }
}
```

#### Get Recent Outbreaks
```
GET /outbreak/recent?limit=100&offset=0
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "outbreaks": [
    {
      "id": 123,
      "device_id": "string",
      "pathogen": "string",
      "result": "string",
      "timestamp": "2024-01-15T10:30:00Z",
      "latitude": -1.2921,
      "longitude": 36.8219,
      "county": "Nairobi",
      "confidence_score": 0.95
    }
  ],
  "count": 100
}
```

#### Get Outbreak by ID
```
GET /outbreak/{id}
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "id": 123,
  "device_id": "string",
  "pathogen": "string",
  "result": "string",
  "timestamp": "2024-01-15T10:30:00Z",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "county": "Nairobi",
  "country": "Kenya",
  "sample_type": "string",
  "confidence_score": 0.95,
  "battery_level": 85,
  "connectivity_status": "strong",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Analytics Endpoints

#### Get Dashboard Statistics
```
GET /analytics/dashboard
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "period": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z"
  },
  "statistics": {
    "total_outbreaks": 150,
    "unique_pathogens": 5,
    "affected_counties": 10,
    "reporting_devices": 25,
    "avg_confidence": 0.92,
    "latest_report": "2024-01-15T10:30:00Z"
  },
  "trends": [
    {
      "date": "2024-01-01",
      "count": 5
    }
  ],
  "byCounty": [
    {
      "county": "Nairobi",
      "total_outbreaks": 50,
      "pathogen_diversity": 3,
      "max_confidence": 0.98,
      "avg_confidence": 0.94
    }
  ]
}
```

#### Get Heatmap Data
```
GET /analytics/heatmap?startDate=2024-01-01&endDate=2024-01-31&minConfidence=0
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "type": "heatmap",
  "data": [
    {
      "latitude": -1.2921,
      "longitude": 36.8219,
      "count": 5,
      "pathogen": "E.coli"
    }
  ],
  "count": 10
}
```

#### Get Clustered Outbreaks
```
GET /analytics/clusters?startDate=2024-01-01&endDate=2024-01-31&zoom=5
Authorization: Bearer <jwt_token>
```

#### Get Pathogen Trend
```
GET /analytics/trend/{pathogen}?days=30
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "pathogen": "E.coli",
  "days": 30,
  "data": [
    {
      "date": "2024-01-01",
      "count": 5
    }
  ]
}
```

### Admin Endpoints

#### Get Audit Logs
```
GET /admin/audit-logs?limit=500&offset=0&device_id=optional
Authorization: Bearer <jwt_token>
Role: admin, health_official
```

Response:
```json
{
  "logs": [
    {
      "id": 1,
      "device_id": "string",
      "user_id": 1,
      "action": "OUTBREAK_UPLOADED",
      "outbreak_id": 123,
      "details": {},
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 50
}
```

#### Get System Health
```
GET /admin/health
Authorization: Bearer <jwt_token>
Role: admin, health_official
```

Response:
```json
{
  "system_health": {
    "active_devices": 25,
    "total_outbreaks": 150,
    "unique_outbreaks": 145,
    "avg_confidence": 0.92,
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Rate Limiting

- Standard: 100 requests per minute per IP
- Authenticated: 1000 requests per minute per user
- Admin: Unlimited

## WebSocket Connection

Connect to: `ws://localhost:3001` (development) or `wss://epicenter-backend.railway.app` (production)

Events:
```json
{
  "type": "outbreak_update",
  "data": {
    "id": 123,
    "pathogen": "E.coli",
    "county": "Nairobi",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
