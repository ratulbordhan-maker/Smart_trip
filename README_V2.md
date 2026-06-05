# 🚀 SmartTrip 2.0 - Premium Travel Booking Platform

A modern, fully-featured travel booking platform built with Spring Boot, React, and premium UI/UX design. **Production-ready with Docker deployment.**

> ✨ **Version 2.0** - Enterprise-grade security, modern UI, and deployment infrastructure included!

---

## 📊 What's New in 2.0

### 🔐 Security & Authentication
- ✅ **JWT Token Authentication** - Secure, stateless authentication
- ✅ **Refresh Token System** - Automatic token renewal
- ✅ **Role-Based Access Control** - USER, AGENCY, ADMIN roles
- ✅ **CORS Configuration** - Restricted to approved domains
- ✅ **Input Validation** - Both frontend and backend validation
- ✅ **Password Encryption** - BCrypt hashing

### 🎨 Premium UI/UX
- ✅ **Tailwind CSS** - Modern utility-first styling
- ✅ **Dark Mode Support** - Automatic theme switching
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Smooth Animations** - Framer Motion transitions
- ✅ **Reusable Components** - Button, Card, Input, Select, Badge, Modal
- ✅ **Toast Notifications** - Real-time user feedback

### 🏗️ Architecture
- ✅ **Docker & Docker Compose** - One-command deployment
- ✅ **Environment Configuration** - Dev/Prod profiles
- ✅ **Global Exception Handling** - Centralized error management
- ✅ **State Management** - Zustand for predictable state
- ✅ **API Client** - Axios with JWT interceptors
- ✅ **Custom Hooks** - useAuth, useRole, useTheme

### 🎯 Feature Enhancements
- ✅ **Advanced Search** - Filter by destination, price, dates
- ✅ **Wishlist** - Save favorite packages
- ✅ **User Profiles** - Avatar upload, profile management
- ✅ **Reviews & Ratings** - 1-5 star ratings with comments
- ✅ **Booking Management** - Full lifecycle management
- ✅ **Admin Analytics** - Dashboard with statistics
- ✅ **Agency Portal** - Package creation & management

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for frontend development)

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd smarttrip

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up -d

# Verify
docker-compose ps
curl http://localhost:8080/health
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MySQL: localhost:3306

### Option 2: Local Development

**Backend:**
```bash
cd smarttrip
cp .env.example .env
export SPRING_PROFILES_ACTIVE=dev
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd smarttrip-frontend
cp .env.example .env
npm install
npm start
```

---

## 📁 Project Structure

```
smarttrip/
├── src/main/java/com/smarttrip/smarttrip/
│   ├── AuthController.java              # NEW: JWT authentication
│   ├── AuthService.java                 # NEW: Auth logic
│   ├── JwtUtil.java                     # NEW: Token generation
│   ├── JwtAuthenticationFilter.java      # NEW: JWT validation
│   ├── GlobalExceptionHandler.java       # ENHANCED: Error handling
│   ├── SecurityConfig.java               # UPDATED: JWT config
│   ├── WishlistController.java           # NEW: Favorites
│   ├── WishlistService.java              # NEW: Wishlist logic
│   └── [Other entities & services]
├── src/main/resources/
│   ├── application.properties            # Base config
│   ├── application-dev.properties        # Development
│   ├── application-prod.properties       # Production
│   └── db/migration/                     # Database migrations
├── smarttrip-frontend/src/
│   ├── api-new.js                        # NEW: Enhanced API client
│   ├── store.js                          # NEW: Zustand stores
│   ├── hooks/useAuth.js                  # NEW: Auth hook
│   ├── components/UI.jsx                 # NEW: Reusable components
│   ├── components/Notifications.jsx      # NEW: Toast system
│   └── [Feature components]
├── Dockerfile                            # NEW: Container image
├── docker-compose.yml                    # NEW: Full stack setup
├── DEPLOYMENT.md                         # NEW: Deployment guide
├── UPGRADE_GUIDE.md                      # NEW: Migration guide
└── .env.example                          # NEW: Config template
```

---

## 🔐 Authentication Flow

```
User Credentials
      ↓
/auth/login (POST)
      ↓
Backend validates & generates JWT
      ↓
Returns: token + refreshToken + user
      ↓
Frontend stores in localStorage
      ↓
Add "Authorization: Bearer <token>" to all requests
      ↓
On expiration: Use refreshToken to get new token
```

---

## 📊 Database Schema

### Core Entities
- **User** - User accounts with roles (USER, AGENCY, ADMIN)
- **TravelPackage** - Travel packages created by agencies
- **Booking** - Bookings made by users
- **Review** - Ratings and reviews for packages
- **Wishlist** - User's favorite packages (NEW)
- **Coupon** - Discount codes with PERCENT/FLAT types

### Entity Relationships
```
User (1) ──→ (N) TravelPackage (createdBy)
User (1) ──→ (N) Booking
User (1) ──→ (N) Review
User (1) ──→ (N) Wishlist
TravelPackage (1) ──→ (N) Booking
TravelPackage (1) ──→ (N) Review
TravelPackage (1) ──→ (N) Wishlist
```

---

## 🛠️ API Endpoints

### Authentication
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login` | No | User login |
| POST | `/auth/register` | No | User registration |
| POST | `/auth/refresh` | No | Refresh token |
| GET | `/auth/validate` | Yes | Validate token |
| POST | `/auth/logout` | Yes | Logout |

### Travel Packages
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/packages` | No | List all packages |
| GET | `/packages/{id}` | No | Get package details |
| GET | `/packages/agency/{id}` | Yes | Agency's packages |
| POST | `/packages` | Yes | Create package |
| PUT | `/packages/{id}` | Yes | Update package |
| PATCH | `/packages/{id}/deactivate` | Yes | Deactivate package |

### Bookings
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/bookings` | Admin | All bookings |
| GET | `/bookings/user/{id}` | Yes | User's bookings |
| GET | `/bookings/agency/{id}` | Yes | Agency's bookings |
| POST | `/bookings` | Yes | Create booking |
| PATCH | `/bookings/{id}/approve` | Yes | Approve booking |
| PATCH | `/bookings/{id}/reject` | Yes | Reject booking |
| PATCH | `/bookings/{id}/cancel` | Yes | Cancel booking |

### Wishlist (NEW)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/wishlists/user/{id}` | Yes | User's wishlist |
| POST | `/wishlists/add/{packageId}` | Yes | Add to wishlist |
| DELETE | `/wishlists/remove/{packageId}` | Yes | Remove from wishlist |
| GET | `/wishlists/check/{packageId}` | Yes | Check if in wishlist |

### Users & Reviews
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/users` | Admin | All users |
| GET | `/users/{id}` | Yes | User details |
| DELETE | `/users/{id}` | Admin | Delete user |
| GET | `/reviews/package/{id}` | No | Package reviews |
| POST | `/reviews` | Yes | Add review |

---

## 🎨 UI Components

### Reusable Components (src/components/UI.jsx)

```jsx
// Button - Multiple variants
<Button variant="primary" size="md" loading={false}>
  Login
</Button>

// Form Inputs
<Input label="Email" type="email" placeholder="user@example.com" />
<Select label="Role" options={options} />

// Cards
<Card hoverable className="p-6">
  Package information
</Card>

// Status indicators
<Badge variant="success">Confirmed</Badge>

// Loading & Empty states
<Loading />
<EmptyState icon={EmptyIcon} title="No bookings" />

// Modal dialogs
<Modal isOpen={open} onClose={close} title="Confirm">
  Are you sure?
</Modal>
```

---

## 📱 Frontend State Management

### Zustand Stores

```javascript
// Authentication
import { useAuthStore } from './store';
const { user, isAuthenticated, login, logout } = useAuthStore();

// Theme
import { useThemeStore } from './store';
const { isDark, toggleTheme } = useThemeStore();

// Notifications
import { useNotificationStore } from './store';
const { success, error, info } = useNotificationStore();

// Filters
import { useFilterStore } from './store';
const { filters, setFilter } = useFilterStore();

// Cart/Bookings
import { useCartStore } from './store';
const { items, addItem, removeItem } = useCartStore();
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Environment Variables (Production)

```bash
# Database
DB_URL=jdbc:mysql://mysql:3306/smarttrip
DB_USER=smarttrip
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-32-character-secret-key
JWT_EXPIRATION=86400000

# URLs
APP_FRONTEND_URL=https://yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
```

### Cloud Deployment Options
- ✅ AWS EC2 with Docker
- ✅ Heroku with Git deployment
- ✅ DigitalOcean App Platform
- ✅ Google Cloud Run
- ✅ Azure Container Instances

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide for all platforms |
| [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) | Migration guide from v1.0 to v2.0 |
| [FRONTEND_README.md](./smarttrip-frontend/FRONTEND_README.md) | Frontend development guide |
| [API Documentation](#-api-endpoints) | API endpoint reference |

---

## 🔒 Security Features

- ✅ **JWT Tokens** - Secure, stateless authentication
- ✅ **CORS Protection** - Restricted to approved origins
- ✅ **Input Validation** - Hibernate Validator
- ✅ **Password Hashing** - BCrypt encryption
- ✅ **SQL Injection Prevention** - JPA parameterized queries
- ✅ **XSS Protection** - React's built-in escaping
- ✅ **Environment Variables** - Secrets in .env
- ✅ **HTTPS Ready** - Full SSL/TLS support

---

## 📊 Performance Optimizations

### Backend
- Connection pooling (HikariCP)
- Database indexing
- Query optimization
- Caching with JWT
- Compression enabled

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- CSS minification
- Production build optimization

---

## 🧪 Testing

### Backend
```bash
cd smarttrip
mvn test
```

### Frontend
```bash
cd smarttrip-frontend
npm test
```

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# Check if port 8080 is in use
lsof -i :8080

# View container logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache
```

### JWT Token Errors
- Ensure `JWT_SECRET` is ≥ 32 characters
- Check `Authorization: Bearer <token>` header format
- Verify token hasn't expired
- Check clock sync between client/server

### Database Connection
```bash
# Test MySQL connection
mysql -h 127.0.0.1 -u smarttrip -p

# View database logs
docker-compose logs mysql
```

---

## 📈 What Makes This Premium

1. **Enterprise Architecture** - Production-ready code structure
2. **Modern Styling** - Tailwind CSS with dark mode
3. **Security First** - JWT, validation, CORS protection
4. **Responsive Design** - Works perfectly on all devices
5. **Deployment Ready** - Docker, environment configs, guides
6. **Error Handling** - Comprehensive validation & messages
7. **State Management** - Predictable, maintainable state
8. **Reusable Components** - DRY principle throughout
9. **Performance** - Optimized for speed
10. **Developer Experience** - Clear code, documentation, guides

---

## 🎯 Roadmap

### Phase 3 (Future)
- [ ] Real-time notifications (WebSockets)
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email confirmations (Mailgun/SendGrid)
- [ ] Image uploads to S3
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] GraphQL API
- [ ] Machine learning recommendations

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md)
3. Check frontend [README](./smarttrip-frontend/FRONTEND_README.md)
4. Review API documentation above

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

SmartTrip - A premium travel booking platform

**Version:** 2.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2024

---

<div align="center">

### ⭐ Ready to Deploy?

```bash
docker-compose up -d
```

Visit: http://localhost:3000

</div>
