import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { FiUsers, FiPackage, FiMessageSquare, FiTrendingUp, FiEye, FiDollarSign } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const complaintsPieData = {
    labels: ['Pending', 'Resolved'],
    datasets: [{
      data: [stats.pendingComplaints, stats.resolvedComplaints],
      backgroundColor: ['#dc3545', '#28a745'],
      borderWidth: 2
    }]
  };

  const visitorsBarData = {
    labels: stats.analytics?.map(day => new Date(day.date).toLocaleDateString()) || [],
    datasets: [{
      label: 'Daily Visitors',
      data: stats.analytics?.map(day => day.visitors) || [],
      backgroundColor: '#007bff',
      borderColor: '#0056b3',
      borderWidth: 1
    }]
  };

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-primary text-white rounded-circle p-3">
                  <FiUsers size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Users</h6>
                <h3 className="mb-0">{stats.totalUsers}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-success text-white rounded-circle p-3">
                  <FiPackage size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Products</h6>
                <h3 className="mb-0">{stats.totalProducts}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-warning text-white rounded-circle p-3">
                  <FiMessageSquare size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Complaints</h6>
                <h3 className="mb-0">{stats.totalComplaints}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-info text-white rounded-circle p-3">
                  <FiEye size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Visitors</h6>
                <h3 className="mb-0">{stats.totalVisitors || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Complaints Status</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie data={complaintsPieData} options={{ maintainAspectRatio: false }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Daily Visitors (Last 7 Days)</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={visitorsBarData} 
                  options={{ 
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;