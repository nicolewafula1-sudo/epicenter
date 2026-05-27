# Load Testing & Scalability Guide

## Load Testing Strategy

### Tools
- **Apache JMeter**: Load testing tool
- **Locust**: Python-based load testing
- **k6**: Modern load testing platform
- **Artillery**: Node.js load testing

### Test Scenarios

#### Scenario 1: Normal Operations
- 100 concurrent users
- Submit outbreaks every 5 seconds
- Read analytics every 30 seconds
- Duration: 10 minutes

#### Scenario 2: Peak Load
- 1000 concurrent users
- Submit outbreaks every 2 seconds
- Read analytics every 10 seconds
- Duration: 5 minutes

#### Scenario 3: Stress Test
- 5000 concurrent users
- Submit outbreaks every 1 second
- Read analytics every 5 seconds
- Duration: 2 minutes

### Load Testing Commands

#### Using k6
```bash
# Install k6
# https://k6.io/docs/getting-started/installation/

# Create test script (tests/load-test.js)
# Run test
k6 run tests/load-test.js
```

#### Using Apache JMeter
```bash
# Create test plan in GUI
# Add HTTP requests for endpoints
# Set number of threads (users)
# Run and analyze results
```

### Performance Targets

| Metric | Target | Acceptable |
|--------|--------|------------|
| Response Time (p50) | <200ms | <500ms |
| Response Time (p99) | <1s | <2s |
| Error Rate | <0.1% | <1% |
| Throughput | >1000 req/s | >500 req/s |
| CPU Usage | <60% | <80% |
| Memory Usage | <70% | <85% |
| Database Connection Pool | <15/20 | <18/20 |

## Scalability Architecture

### Horizontal Scaling (More Servers)

#### Load Balancer
```
Client → Load Balancer → [Backend1, Backend2, Backend3]
                             ↓↓↓ (shared)
                          PostgreSQL
```

#### Implementation
- Use Railway auto-scaling
- Add more Node.js instances
- Configure sticky sessions for WebSocket
- Share database across instances

#### Database Connection Pool Per Instance
- Max connections per instance: 20
- With 3 instances: 60 total connections
- PostgreSQL max connections: 100

### Vertical Scaling (Bigger Servers)

#### Railway Plan Upgrades
- Standard: 512 MB RAM, 1 CPU
- Pro: 1 GB RAM, 2 CPUs
- Growth: 2 GB RAM, 4 CPUs
- Enterprise: Custom resources

### Database Optimization

#### PostGIS Performance
```sql
-- Create spatial indexes
CREATE INDEX idx_outbreaks_location ON outbreaks USING GIST(location);
CREATE INDEX idx_kenya_counties_boundary ON kenya_counties USING GIST(boundary);

-- Vacuum and analyze
VACUUM ANALYZE outbreaks;

-- Check query plans
EXPLAIN ANALYZE SELECT * FROM outbreaks WHERE ...;
```

#### Connection Pooling
```javascript
const pool = new Pool({
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Idle timeout
  connectionTimeoutMillis: 2000  // Connection timeout
});
```

#### Query Optimization
- Add indexes on frequently queried columns
- Use LIMIT for large result sets
- Avoid N+1 queries
- Cache frequently accessed data

### Caching Strategy

#### Redis Caching
```javascript
// Cache heatmap data
const cacheKey = `heatmap:${startDate}:${endDate}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Fetch data
const data = await getHeatmapData(startDate, endDate);

// Cache for 1 hour
await redis.setex(cacheKey, 3600, JSON.stringify(data));
```

#### Cache Invalidation
- Invalidate on new outbreak submission
- TTL-based expiration (1 hour)
- Manual invalidation via admin panel

### Message Queue for High Traffic

#### RabbitMQ Setup
```javascript
const amqp = require('amqplib');

// Connect to RabbitMQ
const connection = await amqp.connect('amqp://guest:guest@localhost');
const channel = await connection.createChannel();

// Queue for outbreak processing
await channel.assertQueue('outbreaks', { durable: true });

// Producer: Queue outbreak
await channel.sendToQueue('outbreaks', Buffer.from(JSON.stringify(outbreak)));

// Consumer: Process outbreak
channel.consume('outbreaks', async (msg) => {
  const outbreak = JSON.parse(msg.content.toString());
  await processOutbreak(outbreak);
  channel.ack(msg);
});
```

#### Benefits
- Decouples producers from consumers
- Handles traffic spikes gracefully
- Enables asynchronous processing
- Improves system resilience

### Database Partitioning

#### By Time (Month)
```sql
CREATE TABLE outbreaks_2024_01 PARTITION OF outbreaks
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE outbreaks_2024_02 PARTITION OF outbreaks
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

#### Benefits
- Faster queries on recent data
- Easier maintenance and cleanup
- Better index performance
- Reduced bloat from old data

### CDN for Static Assets

#### Vercel (Frontend)
- Automatic CDN distribution
- Edge caching
- Automatic deployment

#### CloudFront (if needed)
```javascript
// Configure CloudFront distribution
// Cache policy: 1 hour for dynamic, 1 day for static
// Origin: Backend API
// Query string: Whitelist required parameters
```

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Application Metrics**
   - Request latency (p50, p95, p99)
   - Error rate
   - Request throughput
   - Active connections

2. **System Metrics**
   - CPU usage
   - Memory usage
   - Disk usage
   - Network bandwidth

3. **Database Metrics**
   - Query latency
   - Connection pool utilization
   - Lock contention
   - Replication lag

4. **Business Metrics**
   - Outbreak submissions/minute
   - Active devices
   - Affected counties
   - Average confidence score

### Alerting Thresholds

```yaml
alerts:
  - name: high_error_rate
    condition: error_rate > 1%
    action: page_on_call
  
  - name: high_latency
    condition: p99_latency > 2000ms
    action: page_on_call
  
  - name: db_connection_pool_exhausted
    condition: connections_used > 18/20
    action: alert_team
  
  - name: high_cpu_usage
    condition: cpu_usage > 80%
    action: auto_scale_up
```

## Load Test Example (k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = __ENV.API_URL || 'http://localhost:3001/api';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
};

export default function () {
  // Test: Upload outbreak
  const outbreak = {
    device_id: `device-${__VU}`,
    pathogen: 'E.coli',
    result: 'positive',
    timestamp: new Date().toISOString(),
    latitude: -1.2921 + Math.random() * 0.1,
    longitude: 36.8219 + Math.random() * 0.1,
    confidence_score: 0.9,
    battery_level: 80,
    connectivity_status: 'strong',
  };

  const res = http.post(
    `${API_URL}/outbreak/uploadResult`,
    JSON.stringify(outbreak),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-device-token': `token-${__VU}`,
      },
    }
  );

  check(res, {
    'upload status is 201': (r) => r.status === 201,
    'upload time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test: Get analytics
  const analyticsRes = http.get(`${API_URL}/analytics/dashboard`, {
    headers: {
      'Authorization': `Bearer token-${__VU}`,
    },
  });

  check(analyticsRes, {
    'analytics status is 200': (r) => r.status === 200,
    'analytics time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(5);
}
```

## Troubleshooting Performance Issues

### Slow Database Queries
```sql
-- Identify slow queries
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check query plan
EXPLAIN ANALYZE SELECT * FROM outbreaks WHERE ...;

-- Add missing index
CREATE INDEX idx_outbreaks_pathogen_timestamp 
ON outbreaks(pathogen, timestamp);
```

### High Memory Usage
- Check for memory leaks in application
- Reduce connection pool size if not needed
- Enable garbage collection logs
- Monitor with `node --expose-gc`

### High CPU Usage
- Profile application with `clinic.js`
- Check for infinite loops
- Optimize database queries
- Use caching for expensive operations

### Connection Pool Exhaustion
- Increase pool size cautiously
- Close connections properly
- Add connection timeout logging
- Monitor with `netstat`

---

For detailed performance tuning, consult Railway and Vercel documentation.
