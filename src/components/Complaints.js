import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiMessageSquare, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/complaints');
      setComplaints(response.data.complaints || response.data);
    } catch (error) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    reset({
      status: complaint.status,
      priority: complaint.priority,
      adminResponse: complaint.adminResponse || ''
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/complaints/${selectedComplaint._id}`, data);
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      setError('Failed to update complaint');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/complaints/${id}`);
        fetchComplaints();
      } catch (error) {
        setError('Failed to delete complaint');
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'in-progress': 'info',
      'resolved': 'success'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'success'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><FiMessageSquare className="me-2" />Complaints Management</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>{complaint.name}</td>
                  <td>{complaint.email}</td>
                  <td>{complaint.subject}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td>{getPriorityBadge(complaint.priority)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      <FiEye />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteComplaint(complaint._id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* View/Edit Complaint Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        {selectedComplaint && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Name:</strong> {selectedComplaint.name}
                </Col>
                <Col md={6}>
                  <strong>Email:</strong> {selectedComplaint.email}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Phone:</strong> {selectedComplaint.phone || 'N/A'}
                </Col>
                <Col md={6}>
                  <strong>Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}
                </Col>
              </Row>
              <div className="mb-3">
                <strong>Subject:</strong> {selectedComplaint.subject}
              </div>
              <div className="mb-3">
                <strong>Message:</strong>
                <div className="bg-light p-3 rounded mt-2">
                  {selectedComplaint.message}
                </div>
              </div>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select {...register('status')}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select {...register('priority')}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Admin Response</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  {...register('adminResponse')}
                  placeholder="Enter your response to the customer..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update Complaint
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;