# 🚀 SmartTrip Quick Reference Guide

A one-page reference for the major improvements and how to use them.

---

## 🔐 Authentication (JWT)

### Before
```js
localStorage.setItem('userId', user.id);
```

### After
```js
// Automatic via AuthService
const response = await authAPI.login(email, password);
// Returns: { token, refreshToken, user }
// Token auto-sent with every request
```

**Key Files:**
- Backend: `AuthController.java`, `AuthService.java`, `JwtUtil.java`
- Frontend: `hooks/useAuth.js`

---

## 🎨 UI Components

### Before
```jsx
<button>Login</button>
<input type="text" />
```

### After
```jsx
import { Button, Input } from './components/UI';

<Button variant="primary" loading={loading}>Login</Button>
<Input label="Email" type="email" error={error} />
```

**Components Available:**
- Button (5 variants)
- Input (with icons)
- Select (dropdown)
- Card (hoverable)
- Badge (status)
- Modal (dialog)
- Loading (spinner)
- EmptyState (placeholder)

---

## 🌙 Dark Mode

### Before
```js
// Not available
```

### After
```js
import { useThemeStore } from './store';

const { isDark, toggleTheme } = useThemeStore();

<button onClick={toggleTheme}>
  {isDark ? '☀️' : '🌙'}
</button>
```

**Automatic:** System preference or localStorage

---

## 📡 API Client

### Before
```js
const data = await axios.get('http://localhost:8081/packages');
```

### After
```js
import { packageAPI } from './api-new';

const data = await packageAPI.getAll({ 
  destination: 'Paris',
  minPrice: 100 
});
```

**Available APIs:**
- `authAPI` - login, register, refresh
- `packageAPI` - CRUD operations
- `bookingAPI` - booking management
- `reviewAPI` - ratings & reviews
- `userAPI` - user management
- `wishlistAPI` - favorites
- `paymentAPI` - payments
- `analyticsAPI` - statistics

---

## 🗂️ State Management

### Before
```js
const [user, setUser] = useState(null);
const [theme, setTheme] = useState('light');
```

### After
```js
import { useAuthStore, useThemeStore } from './store';

const user = useAuthStore((state) => state.user);
const isDark = useThemeStore((state) => state.isDark);

// Or destructure
const { user } = useAuthStore();
const { isDark } = useThemeStore();
```

**Stores:**
- `useAuthStore` - Authentication
- `useThemeStore` - Dark/Light mode
- `useNotificationStore` - Toast notifications
- `useFilterStore` - Search filters
- `useCartStore` - Booking cart

---

## 🔔 Notifications

### Before
```js
alert('Error: ' + error.message);
```

### After
```js
import { useNotificationStore } from './store';

const { success, error, info } = useNotificationStore();

success('Booking confirmed!');
error('Something went wrong');
info('Processing...');
```

---

## 📦 Project Setup

### Backend
```bash
cd smarttrip
mvn clean install
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
# Runs on http://localhost:8081
```

### Frontend
```bash
cd smarttrip-frontend
npm install
cp .env.example .env
npm start
# Runs on http://localhost:3000
```

### Docker (All-in-one)
```bash
cp .env.example .env
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:3306
```

---

## 📝 Environment Variables

### .env (Docker)
```bash
DB_URL=jdbc:mysql://mysql:3306/smarttrip
DB_USER=smarttrip
DB_PASSWORD=secure_password
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=86400000
APP_FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8080
```

### application-dev.properties (Local)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smarttrip
spring.datasource.username=smarttrip
spring.datasource.password=1234
jwt.secret=dev-secret
```

### application-prod.properties (Production)
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

---

## 🎯 Common Tasks

### Add a New API Endpoint

**Backend:**
```java
@PostMapping("/new-endpoint")
public ResponseEntity<?> newEndpoint(
    @RequestBody MyRequest request,
    @RequestAttribute("userId") Long userId) {
    // Implementation
    return ResponseEntity.ok(response);
}
```

**Frontend (api-new.js):**
```js
export const newAPI = {
  callEndpoint: (data) => api.post('/new-endpoint', data),
};
```

**Component:**
```jsx
import { newAPI } from './api-new';

const response = await newAPI.callEndpoint(data);
```

---

### Create a New Component

**src/components/MyComponent.jsx:**
```jsx
import { Button, Card, Input } from './UI';

export const MyComponent = ({ title, onSubmit }) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Button onClick={onSubmit}>Submit</Button>
    </Card>
  );
};
```

---

### Add Form Validation

```jsx
import { useForm } from 'react-hook-form';
import { Input, Button } from './UI';

export const MyForm = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...register('email', {
          required: 'Email required',
          pattern: { value: /\S+@\S+/, message: 'Invalid email' }
        })}
        error={errors.email?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

---

### Show Toast Notifications

```jsx
import { useNotificationStore } from './store';

const MyComponent = () => {
  const { success, error } = useNotificationStore();

  const handleAction = async () => {
    try {
      await api.post('/endpoint', data);
      success('Operation successful!');
    } catch (err) {
      error(err.response?.data?.message || 'Error occurred');
    }
  };

  return <Button onClick={handleAction}>Action</Button>;
};
```

---

### Check User Role

```jsx
import { useRole } from './hooks/useAuth';

export const AdminPanel = () => {
  const { isAdmin, role } = useRole('ADMIN');

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Dashboard</div>;
};
```

---

## 🐛 Debugging Tips

### Check JWT Token
```js
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
```

### View API Requests
```js
// Network tab in DevTools
// Check Authorization header: Bearer <token>
```

### Backend Logs
```bash
# Docker
docker-compose logs -f backend

# Local
tail -f /var/log/smarttrip/app.log
```

### Check Database
```bash
docker-compose exec mysql mysql -u smarttrip -p smarttrip
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README_V2.md | Overview & features |
| DEPLOYMENT.md | Production deployment |
| UPGRADE_GUIDE.md | Migration from v1.0 |
| FRONTEND_README.md | Frontend development |
| IMPLEMENTATION_SUMMARY.md | What was done |

---

## 🎯 Key Commands

```bash
# Backend
mvn clean install        # Build
mvn spring-boot:run      # Run locally
mvn test                 # Test

# Frontend
npm install              # Install deps
npm start                # Dev server
npm run build            # Production build
npm test                 # Run tests

# Docker
docker-compose up -d     # Start all
docker-compose ps        # Status
docker-compose logs -f   # View logs
docker-compose down      # Stop all
docker-compose build     # Rebuild
```

---

## ⚡ Performance Tips

1. **Code Splitting** - Use React.lazy()
2. **Image Optimization** - Compress before upload
3. **API Caching** - Cache GET requests when possible
4. **Database Indexing** - Index frequently queried columns
5. **Minification** - npm run build handles this

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is ≥ 32 characters
- [ ] CORS restricted to specific domains
- [ ] Input validation on backend
- [ ] Passwords hashed with BCrypt
- [ ] Environment variables use .env
- [ ] HTTPS enabled in production
- [ ] SQL injection prevention (JPA)
- [ ] XSS protection (React escaping)

---

## 📞 Getting Help

1. Check the **DEPLOYMENT.md** for common issues
2. Review **UPGRADE_GUIDE.md** for migration problems
3. See **FRONTEND_README.md** for component usage
4. Check **IMPLEMENTATION_SUMMARY.md** for what changed

---

**Last Updated:** 2024  
**Version:** 2.0  
**Status:** Production Ready ✅
