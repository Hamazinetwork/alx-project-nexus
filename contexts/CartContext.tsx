import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of a product and a cart item
type Product = {
  id: number;
  name: string;
  price: number | string;
  primary_image: string;
};

type CartItem = Product & {
  quantity: number;
};

// Define the state and actions for the reducer
type State = {
  cart: CartItem[];
};

type Action =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

// Define the context type
type CartContextType = {
  cartState: State;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer function
const cartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // If item doesn't exist, add it with quantity 1
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        // If quantity is 0 or less, remove the item
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    
    default:
      return state;
  }
};

const initialState: State = {
  cart: [],
};

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, setCartState] = useState<State>(initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const localData = localStorage.getItem('cart');
      if (localData) {
        const parsedCart = JSON.parse(localData);
        setCartState({ cart: parsedCart });
      }
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartState.cart));
    } catch (error) {
      console.error("Could not save cart to localStorage", error);
    }
  }, [cartState.cart]);

  // Action functions
  const addItem = (product: Product) => {
    setCartState(prevState => cartReducer(prevState, { type: 'ADD_ITEM', payload: product }));
  };

  const removeItem = (id: number) => {
    setCartState(prevState => cartReducer(prevState, { type: 'REMOVE_ITEM', payload: { id } }));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartState(prevState => cartReducer(prevState, { type: 'UPDATE_QUANTITY', payload: { id, quantity } }));
  };

  const clearCart = () => {
    setCartState(prevState => cartReducer(prevState, { type: 'CLEAR_CART' }));
  };

  // Helper functions
  const getTotalItems = (): number => {
    return cartState.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return cartState.cart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const contextValue: CartContextType = {
    cartState,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;