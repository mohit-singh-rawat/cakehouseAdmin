import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';
import { 
  fetchProductsRequest, 
  createProductRequest, 
  updateProductRequest, 
  deleteProductRequest 
} from '../redux/actions/productActions';
import Pagination from './Pagination';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, creating, updating, deleting, pagination } = useSelector(state => state.products);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchProductsRequest(currentPage, 10, searchTerm));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    reset();
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    reset(product);
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (editingProduct) {
      dispatch(updateProductRequest(editingProduct._id, data));
    } else {
      dispatch(createProductRequest(data));
    }
    setShowModal(false);
    reset();
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProductRequest(id));
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><FiPackage className="me-2" />Products Management</h1>
        <div className="d-flex gap-3">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '250px' }}
          />
          <Button variant="primary" onClick={handleAddProduct}>
            <FiPlus className="me-2" />Add Product
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.imageUrl || product.image || '/placeholder.jpg'} 
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      className="rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    <Badge bg="secondary">{product.category}</Badge>
                  </td>
                  <td>${product.price}</td>
                  <td>
                    <Badge bg={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEditProduct(product)}
                      disabled={updating}
                    >
                      <FiEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={deleting}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    {loading ? 'Loading products...' : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        
        {/* Pagination */}
        <Card.Footer className="bg-white border-top-0">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={handlePageChange}
          />
        </Card.Footer>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    {...register('name', { required: 'Product name is required' })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select {...register('category', { required: 'Category is required' })}>
                    <option value="">Select Category</option>
                    <option value="cakes">Cakes</option>
                    <option value="fastfood">Fast Food</option>
                    <option value="combos">Combos</option>
                    <option value="toys">Toys</option>
                    <option value="drinks">Drinks</option>
                    <option value="party-supplies">Party Supplies</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required' })}
                    isInvalid={!!errors.price}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    {...register('stock', { required: 'Stock is required' })}
                    isInvalid={!!errors.stock}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register('description', { required: 'Description is required' })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                {...register('image')}
                placeholder="Enter image URL"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;