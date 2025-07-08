import { PRODUCT_ACTIONS } from '../actions/productActions';

const initialState = {
  products: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Products
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        products: action.payload.data, 
        pagination: action.payload.pagination,
        error: null 
      };
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create Product
    case PRODUCT_ACTIONS.CREATE_PRODUCT_REQUEST:
      return { ...state, creating: true, error: null };
    case PRODUCT_ACTIONS.CREATE_PRODUCT_SUCCESS:
      return { 
        ...state, 
        creating: false, 
        products: [...state.products, action.payload],
        error: null 
      };
    case PRODUCT_ACTIONS.CREATE_PRODUCT_FAILURE:
      return { ...state, creating: false, error: action.payload };

    // Update Product
    case PRODUCT_ACTIONS.UPDATE_PRODUCT_REQUEST:
      return { ...state, updating: true, error: null };
    case PRODUCT_ACTIONS.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        updating: false,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
        error: null
      };
    case PRODUCT_ACTIONS.UPDATE_PRODUCT_FAILURE:
      return { ...state, updating: false, error: action.payload };

    // Delete Product
    case PRODUCT_ACTIONS.DELETE_PRODUCT_REQUEST:
      return { ...state, deleting: true, error: null };
    case PRODUCT_ACTIONS.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        deleting: false,
        products: state.products.filter(product => product._id !== action.payload),
        error: null
      };
    case PRODUCT_ACTIONS.DELETE_PRODUCT_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    default:
      return state;
  }
};

export default productReducer;