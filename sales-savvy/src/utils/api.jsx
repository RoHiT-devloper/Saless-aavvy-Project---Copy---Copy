// API configuration
const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  SIGNIN: `${API_BASE_URL}/api/auth/signin`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // Product endpoints
  GET_ALL_PRODUCTS: `${API_BASE_URL}/getAllProducts`,
  ADD_PRODUCT: `${API_BASE_URL}/addProduct`,
  UPDATE_PRODUCT: `${API_BASE_URL}/updateProduct`,
  DELETE_PRODUCT: `${API_BASE_URL}/deleteProduct`,
  SEARCH_PRODUCT: `${API_BASE_URL}/searchProduct`,
  
  // Cart endpoints
  GET_CART: `${API_BASE_URL}/api/cart/getCart`,
  ADD_TO_CART: `${API_BASE_URL}/addToCart`,
  UPDATE_CART: `${API_BASE_URL}/api/cart/update`,
  REMOVE_FROM_CART: `${API_BASE_URL}/api/cart/remove`,
  
  // Order endpoints
  SAVE_ORDER: `${API_BASE_URL}/api/orders/save`,
  GET_ORDERS: `${API_BASE_URL}/api/orders`,
  GET_USER_ORDERS: `${API_BASE_URL}/api/orders/user`,
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};