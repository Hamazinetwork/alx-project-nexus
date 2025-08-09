// /services/wishlistService.ts

const API_BASE_URL = 'https://martafrica.onrender.com/api';

/**
 * Fetches the user's entire wishlist.
 * Requires an auth token.
 */
export const getWishlist = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  return response.json();
};

/**
 * Adds a single product to the user's wishlist.
 * Requires an auth token and the ID of the product to add.
 */
export const addToWishlist = async (productId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  });

  if (!response.ok) {
    // The backend sends a 400 if the item is already in the wishlist
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add item to wishlist');
  }
  return response.json();
};

/**
 * Removes an item from the user's wishlist.
 * Note: This uses the WISHLIST ITEM ID, not the product ID.
 * Requires an auth token.
 */
export const removeFromWishlist = async (wishlistItemId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${wishlistItemId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // DELETE requests often return a 204 No Content, which is successful
  if (response.status !== 204) {
    throw new Error('Failed to remove item from wishlist');
  }

  // No content to return on success, so we return true
  return true;
};