# SmartTrip Frontend - Premium Travel Booking UI

A modern, responsive React frontend for the SmartTrip travel booking platform with Tailwind CSS, dark mode, and premium UX.

## 🚀 Features

- **Modern UI Design**: Built with Tailwind CSS and custom components
- **Dark Mode Support**: Seamless light/dark theme switching
- **Responsive Design**: Mobile-first, works on all devices
- **JWT Authentication**: Secure token-based authentication
- **Real-time Notifications**: Toast notifications for user feedback
- **Advanced Search**: Filter packages by destination, price, dates
- **User Profiles**: Complete user management with avatar uploads
- **Wishlist**: Save favorite packages
- **Booking System**: Seamless booking and payment flow
- **Admin Dashboard**: Analytics and management tools
- **Agency Portal**: Create and manage travel packages
- **Performance**: Code splitting, lazy loading, optimized builds

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Tailwind CSS 3** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Chart.js** - Data visualization

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Create Environment File**
```bash
cp .env.example .env
```

3. **Configure API URL**
```env
REACT_APP_API_URL=http://localhost:8081
```

4. **Start Development Server**
```bash
npm start
```

5. **Application runs on**: http://localhost:3000

## 📝 Environment Variables

```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:8081

# Optional: Razorpay keys for payment integration
REACT_APP_RAZORPAY_KEY_ID=your_key_id
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── UI.jsx                 # Reusable components (Button, Card, Input, etc.)
│   ├── Notifications.jsx      # Toast notifications
│   ├── Navbar.jsx            # Navigation component
│   ├── Sidebar.jsx           # Sidebar for mobile
│   └── [Feature Components]  # Login, Dashboard, etc.
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── [Other pages]
├── store.js                   # Zustand state management
├── api-new.js                # Axios API client with interceptors
├── hooks/
│   └── useAuth.js            # Custom authentication hook
├── styles/
│   └── globals.css           # Global Tailwind styles
├── utils/
│   └── validators.js         # Form validation utilities
└── App.js                    # Main app component
```

## 🎨 Component Usage Examples

### Button Component
```jsx
import { Button } from './components/UI';

<Button variant="primary" size="md">
  Click Me
</Button>

<Button variant="outline" icon={PlusIcon} iconPosition="left">
  Add New
</Button>
```

### Card Component
```jsx
import { Card } from './components/UI';

<Card hoverable className="p-6">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Form Input
```jsx
import { Input } from './components/UI';

<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errors.email}
/>
```

### Notifications
```jsx
import { useNotificationStore } from './store';

const { success, error } = useNotificationStore();

success('Booking confirmed!');
error('Something went wrong');
```

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token and refresh token
3. Token stored in localStorage
4. Token automatically added to API requests
5. On token expiration, refresh token used to get new token
6. If refresh fails, user redirected to login

## 🎯 Responsive Design Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌙 Dark Mode

Dark mode is automatically detected from system preferences but can be toggled:

```jsx
import { useThemeStore } from './store';

const { isDark, toggleTheme } = useThemeStore();

<button onClick={toggleTheme}>
  {isDark ? '☀️' : '🌙'}
</button>
```

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Build Optimizations
- Code splitting with React.lazy()
- Tree shaking (unused code removal)
- Minification and compression
- Image optimization
- CSS purging

## 🧪 Testing

```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## 📊 Performance Metrics

Target metrics:
- **Lighthouse Score**: > 90
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

## 🔧 Configuration Files

### tailwind.config.js
Customizes Tailwind theme, colors, fonts, and animations.

### postcss.config.js
Processes CSS with Tailwind and Autoprefixer.

### .env.example
Template for environment variables.

## 📱 Mobile Optimization

- Touch-friendly buttons (min 44x44px)
- Mobile-first responsive design
- Optimized images for mobile
- Fast load times with code splitting
- Offline capability (PWA ready)

## 🚨 Error Handling

Comprehensive error handling:
- Form validation errors
- API error responses
- Authentication failures
- Network errors
- User-friendly error messages

## 🎯 Best Practices

1. **Component Composition**: Small, focused components
2. **State Management**: Zustand for global state
3. **API Handling**: Centralized API client with interceptors
4. **Error Handling**: Graceful error handling and user feedback
5. **Performance**: Code splitting, lazy loading, memoization
6. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
7. **Security**: JWT tokens, input validation, XSS prevention

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Need Help?** Check the [main README](../README.md) or review the [Deployment Guide](../DEPLOYMENT.md).
