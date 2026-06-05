import { create } from 'zustand';

// ==================== AUTH STORE ====================
export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  
  login: (user, token, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateUser: (updatedUser) => {
    const newUser = { ...useAuthStore.getState().user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser });
  },
}));

// ==================== THEME STORE ====================
export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark' || 
          window.matchMedia('(prefers-color-scheme: dark)').matches,
  
  toggleTheme: () => set((state) => {
    const newDark = !state.isDark;
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
    return { isDark: newDark };
  }),
  
  setTheme: (isDark) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    set({ isDark });
  },
}));

// ==================== NOTIFICATION STORE ====================
export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now();
    const notif = { id, ...notification, duration: notification.duration || 3000 };
    
    set((state) => ({
      notifications: [...state.notifications, notif],
    }));
    
    if (notif.duration > 0) {
      setTimeout(() => {
        useNotificationStore.getState().removeNotification(id);
      }, notif.duration);
    }
    
    return id;
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
  
  success: (message) => useNotificationStore.getState().addNotification({
    type: 'success',
    message,
  }),
  
  error: (message) => useNotificationStore.getState().addNotification({
    type: 'error',
    message,
    duration: 5000,
  }),
  
  info: (message) => useNotificationStore.getState().addNotification({
    type: 'info',
    message,
  }),
  
  warning: (message) => useNotificationStore.getState().addNotification({
    type: 'warning',
    message,
  }),
}));

// ==================== FILTER STORE ====================
export const useFilterStore = create((set) => ({
  filters: {
    destination: '',
    minPrice: 0,
    maxPrice: 100000,
    startDate: null,
    endDate: null,
    rating: 0,
    sortBy: 'popular',
  },
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  
  resetFilters: () => set({
    filters: {
      destination: '',
      minPrice: 0,
      maxPrice: 100000,
      startDate: null,
      endDate: null,
      rating: 0,
      sortBy: 'popular',
    },
  }),
}));

// ==================== CART STORE (for bookings) ====================
export const useCartStore = create((set) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addItem: (item) => set((state) => {
    const newItems = [...state.items, { ...item, id: Date.now() }];
    localStorage.setItem('cart', JSON.stringify(newItems));
    return { items: newItems };
  }),
  
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter((item) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(newItems));
    return { items: newItems };
  }),
  
  updateItem: (id, updates) => set((state) => {
    const newItems = state.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem('cart', JSON.stringify(newItems));
    return { items: newItems };
  }),
  
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },
  
  getTotalPrice: () => {
    return useCartStore.getState().items.reduce((sum, item) => sum + item.price, 0);
  },
}));
