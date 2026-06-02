import {
  CART_START,
  CART_SUCCESS,
  CART_FAILURE,
  CART_CLEAR,
} from '../types';

const initialState = {
  cart: null,
  loading: false,
  error: null,
  cartItemsCount: 0,
  cartTotalPrice: 0,
};

const calculateTotals = (cart) => {
  const items = cart?.items || [];
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = items.reduce((total, item) => total + item.quantity * (item.price || item.productId?.price || 0), 0);
  return { cartItemsCount, cartTotalPrice };
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case CART_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CART_SUCCESS:
      const totals = calculateTotals(action.payload);
      return {
        ...state,
        cart: action.payload,
        loading: false,
        cartItemsCount: totals.cartItemsCount,
        cartTotalPrice: totals.cartTotalPrice,
        error: null,
      };
    case CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CART_CLEAR:
      return {
        ...state,
        cart: null,
        loading: false,
        cartItemsCount: 0,
        cartTotalPrice: 0,
        error: null,
      };
    default:
      return state;
  }
}
