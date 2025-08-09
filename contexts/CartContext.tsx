import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';

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

const initialState: State = {
  cart: [],
};

// Reducer function to manage cart state
const cartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        // If item exists, update its quantity
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Otherwise, add the new item to the cart
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};

// Create the context
const CartContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Context provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    // Lazy initialization from localStorage
    try {
      const localData = localStorage.getItem('cart');
      return localData ? { cart: JSON.parse(localData) } : initial;
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return initial;
    }
  });

  // Persist cart to localStorage on state change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};