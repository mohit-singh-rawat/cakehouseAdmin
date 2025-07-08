// Product Action Types
export const PRODUCT_ACTIONS = {
  // Fetch Products
  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',
  
  // Create Product
  CREATE_PRODUCT_REQUEST: 'CREATE_PRODUCT_REQUEST',
  CREATE_PRODUCT_SUCCESS: 'CREATE_PRODUCT_SUCCESS',
  CREATE_PRODUCT_FAILURE: 'CREATE_PRODUCT_FAILURE',
  
  // Update Product
  UPDATE_PRODUCT_REQUEST: 'UPDATE_PRODUCT_REQUEST',
  UPDATE_PRODUCT_SUCCESS: 'UPDATE_PRODUCT_SUCCESS',
  UPDATE_PRODUCT_FAILURE: 'UPDATE_PRODUCT_FAILURE',
  
  // Delete Product
  DELETE_PRODUCT_REQUEST: 'DELETE_PRODUCT_REQUEST',
  DELETE_PRODUCT_SUCCESS: 'DELETE_PRODUCT_SUCCESS',
  DELETE_PRODUCT_FAILURE: 'DELETE_PRODUCT_FAILURE',
};

// Action Creators
export const fetchProductsRequest = (page = 1, limit = 10, search = '') => ({
  type: PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST,
  payload: { page, limit, search },
});

export const createProductRequest = (productData) => ({
  type: PRODUCT_ACTIONS.CREATE_PRODUCT_REQUEST,
  payload: productData,
});

export const updateProductRequest = (id, productData) => ({
  type: PRODUCT_ACTIONS.UPDATE_PRODUCT_REQUEST,
  payload: { id, productData },
});

export const deleteProductRequest = (id) => ({
  type: PRODUCT_ACTIONS.DELETE_PRODUCT_REQUEST,
  payload: id,
});