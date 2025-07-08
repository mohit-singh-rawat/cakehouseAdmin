import { call, put, takeEvery } from 'redux-saga/effects';
import { productsAPI } from '../api';
import { PRODUCT_ACTIONS } from '../actions/productActions';

// Fetch Products Saga
function* fetchProductsSaga(action) {
  try {
    const { page, limit, search } = action.payload || {};
    const response = yield call(productsAPI.getAll, page, limit, search);
    
    yield put({
      type: PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS,
      payload: {
        data: response.data?.data || [],
        pagination: response.data?.pagination || {}
      }
    });
  } catch (error) {
    yield put({
      type: PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch products'
    });
  }
}

// Create Product Saga
function* createProductSaga(action) {
  try {
    const response = yield call(productsAPI.create, action.payload);
    const product = response.data?.data || response.data;
    yield put({
      type: PRODUCT_ACTIONS.CREATE_PRODUCT_SUCCESS,
      payload: product
    });
    // Refresh products list
    yield put({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST });
  } catch (error) {
    yield put({
      type: PRODUCT_ACTIONS.CREATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || 'Failed to create product'
    });
  }
}

// Update Product Saga
function* updateProductSaga(action) {
  try {
    const { id, productData } = action.payload;
    const response = yield call(productsAPI.update, id, productData);
    yield put({
      type: PRODUCT_ACTIONS.UPDATE_PRODUCT_SUCCESS,
      payload: response.data
    });
    // Refresh products list
    yield put({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST });
  } catch (error) {
    yield put({
      type: PRODUCT_ACTIONS.UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || 'Failed to update product'
    });
  }
}

// Delete Product Saga
function* deleteProductSaga(action) {
  try {
    yield call(productsAPI.delete, action.payload);
    yield put({
      type: PRODUCT_ACTIONS.DELETE_PRODUCT_SUCCESS,
      payload: action.payload
    });
  } catch (error) {
    yield put({
      type: PRODUCT_ACTIONS.DELETE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || 'Failed to delete product'
    });
  }
}

// Watcher Saga
function* productSaga() {
  yield takeEvery(PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeEvery(PRODUCT_ACTIONS.CREATE_PRODUCT_REQUEST, createProductSaga);
  yield takeEvery(PRODUCT_ACTIONS.UPDATE_PRODUCT_REQUEST, updateProductSaga);
  yield takeEvery(PRODUCT_ACTIONS.DELETE_PRODUCT_REQUEST, deleteProductSaga);
}

export default productSaga;