# SmartTrip - Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy SmartTrip (backend + frontend + database) to production environments.

## Prerequisites
- Docker & Docker Compose installed
- MySQL 8.0 (if not using Docker)
- Java 17+ (for local development)
- Node.js 18+ (for frontend development)

## Quick Start with Docker

### 1. Clone Repository
```bash
git clone <repository-url>
cd smarttrip
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your production values
```

### 3. Generate JWT Secret
```bash
# Generate a secure 32+ character JWT secret
openssl rand -base64 32
# Add to .env as JWT_SECRET
```

### 4. Start All Services
```bash
docker-compose up -d
```

### 5. Verify Services
```bash
# Check running containers
docker-compose ps

# View backend logs
docker-compose logs -f backend

# Check MySQL connection
docker-compose exec mysql mysql -u smarttrip -p smarttrip
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health Check: http://localhost:8080/health

---

## Local Development Setup

### Backend Setup

#### 1. Install Dependencies
```bash
cd smarttrip
mvn clean install
```

#### 2. Configure Database
```properties
# application-dev.properties
spring.datasource.url=jdbc:mysql://localhost:3306/smarttrip
spring.datasource.username=smarttrip
spring.datasource.password=1234
```

#### 3. Run Application
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

#### 4. Backend runs on: http://localhost:8081

### Frontend Setup

#### 1. Install Dependencies
```bash
cd smarttrip-frontend
npm install
```

#### 2. Configure API Endpoint
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8081" > .env
```

#### 3. Start Development Server
```bash
npm start
```

#### 4. Frontend runs on: http://localhost:3000

---

## Production Deployment

### Cloud Deployment Options

#### AWS EC2
1. SSH into your EC2 instance
2. Install Docker & Docker Compose
3. Clone repository
4. Create `.env` with production variables
5. Run `docker-compose up -d`
6. Configure security groups for ports 80, 443, 3000, 8080
7. Setup Let's Encrypt SSL certificates using Certbot

#### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create smarttrip-app

# Deploy backend
git subtree push --prefix smarttrip heroku main

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set DB_URL=your-db-url
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build commands:
   - Backend: `mvn clean package -DskipTests`
   - Frontend: `npm install && npm run build`
3. Set environment variables
4. Deploy

### Database Migration

#### Using Flyway (Recommended)
1. Create migration files in `src/main/resources/db/migration/`
2. Format: `V1__Initial_schema.sql`, `V2__Add_users.sql`
3. Flyway automatically runs on application startup in production

Example migration:
```sql
-- V1__Initial_schema.sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables Reference

```bash
# Database
DB_URL=jdbc:mysql://hostname:3306/smarttrip
DB_USER=smarttrip
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-32-character-secret-key-here
JWT_EXPIRATION=86400000          # 24 hours
JWT_REFRESH_EXPIRATION=604800000  # 7 days

# Application
APP_FRONTEND_URL=https://yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com

# Email (optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Spring
SPRING_PROFILES_ACTIVE=prod
```

---

## Security Best Practices

### 1. SSL/TLS Certificate
```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### 2. Update SecurityConfig
```properties
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.same-site=strict
```

### 3. API Rate Limiting
Install RateLimiter dependency and configure for authentication endpoints.

### 4. Database Backup
```bash
# Automated daily MySQL backups
0 2 * * * /usr/local/bin/backup-db.sh
```

### 5. Monitor Logs
```bash
# View real-time logs
docker-compose logs -f backend
tail -f logs/smarttrip/app.log
```

---

## Monitoring & Logging

### Health Check Endpoint
```bash
curl http://localhost:8080/health
```

### Application Logs
```bash
# Development
tail -f /var/log/smarttrip/app.log

# Docker
docker-compose logs --tail=100 backend
```

### Database Logs
```bash
docker-compose logs --tail=50 mysql
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep -E "DB_|JWT_"

# Rebuild images
docker-compose up --build
```

### Database Connection Issues
```bash
# Test MySQL connection
docker-compose exec mysql mysql -h mysql -u smarttrip -p

# Check volume permissions
docker volume ls
docker volume inspect smarttrip_mysql_data
```

### JWT Token Errors
- Ensure `JWT_SECRET` is at least 32 characters
- Verify token expiration time
- Check Authorization header format: `Bearer <token>`

### CORS Issues
- Update `CORS_ALLOWED_ORIGINS` in SecurityConfig
- Verify frontend URL in `.env`

---

## Performance Optimization

### Backend
1. Database indexing on frequently queried columns
2. Connection pooling (HikariCP configured)
3. Lazy loading for large datasets
4. Query optimization with projection

### Frontend
1. Code splitting with React.lazy()
2. Image optimization/compression
3. Minification in production build
4. CDN for static assets

---

## Updating the Application

### Zero-Downtime Deployment
```bash
# Blue-Green Deployment with Docker
# 1. Build new image
docker build -t smarttrip:v2 .

# 2. Update docker-compose.yml
# 3. Restart services gradually
docker-compose up -d backend

# 4. Verify new version
curl http://localhost:8080/health

# 5. Monitor and rollback if needed
docker-compose down
```

---

## Support & Issues

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Test database connectivity
4. Ensure ports are available
5. Check Docker daemon status

---

**Last Updated:** 2024
**Version:** 1.0
