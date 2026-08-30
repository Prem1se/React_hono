import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const GUEST_CART_KEY = 'guest_cart';

const loadGuestCart = () => {
  try {
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [cartPreview, setCartPreview] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems(loadGuestCart());
      return;
    }
    try {
      setLoading(true);
      const data = await cartAPI.get();
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const guestCart = loadGuestCart();
      if (guestCart.length > 0) {
        const mergeGuestCart = async () => {
          try {
            for (const item of guestCart) {
              await cartAPI.add(item.productId, item.quantity);
            }
            localStorage.removeItem(GUEST_CART_KEY);
          } catch (err) {
            console.error('Ошибка слияния корзины:', err);
          }
        };
        mergeGuestCart().then(() => fetchCart());
      } else {
        fetchCart();
      }
    } else {
      setCartItems(loadGuestCart());
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    setLastAddedItem({ ...product, quantity });
    setCartPreview(true);
    setTimeout(() => setCartPreview(false), 3000);

    if (!user) {
      const guestCart = loadGuestCart();
      const existing = guestCart.find(item => item.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({
          productId: product.id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
          categoryId: product.categoryId,
        });
      }
      saveGuestCart(guestCart);
      setCartItems(guestCart);
      return;
    }

    try {
      const data = await cartAPI.add(product.id, quantity);
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      const guestCart = loadGuestCart();
      if (quantity <= 0) {
        const filtered = guestCart.filter(item => item.productId !== productId);
        saveGuestCart(filtered);
        setCartItems(filtered);
      } else {
        const item = guestCart.find(item => item.productId === productId);
        if (item) {
          item.quantity = quantity;
          saveGuestCart(guestCart);
          setCartItems([...guestCart]);
        }
      }
      return;
    }

    try {
      const data = await cartAPI.update(productId, quantity);
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      const guestCart = loadGuestCart();
      const filtered = guestCart.filter(item => item.productId !== productId);
      saveGuestCart(filtered);
      setCartItems(filtered);
      return;
    }

    try {
      const data = await cartAPI.remove(productId);
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Ошибка удаления из корзины:', err);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCartItems([]);
      return;
    }

    try {
      await cartAPI.clear();
      setCartItems([]);
    } catch (err) {
      console.error('Ошибка очистки корзины:', err);
    }
  };

  const getTotalPrice = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const qty = item.quantity || 1;
      return sum + (price * qty);
    }, 0);
  };

  const getTotalItems = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalItems,
      lastAddedItem,
      cartPreview,
    }}>
      {children}
    </CartContext.Provider>
  );
};