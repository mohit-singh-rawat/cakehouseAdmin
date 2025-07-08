import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { FiBarChart, FiTrendingUp, FiPackage, FiUsers } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const Analytics = () => {
  const [productAnalytics, setProductAnalytics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [productResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/analytics/products'),
        axios.get('http://localhost:5000/api/admin/dashboard/stats')
      ]);
      
      setProductAnalytics(productResponse.data);
      setDashboardStats(statsResponse.data);
    } catch (error) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Stock levels chart
  const stockData = {
    labels: productAnalytics?.products?.map(p => p.name) || [],
    datasets: [{
      label: 'Stock Levels',
      data: productAnalytics?.products?.map(p => p.stock) || [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderWidth: 1
    }]
  };

  // Category distribution
  const categoryData = {
    labels: productAnalytics?.categoryStats?.map(c => c._id) || [],
    datasets: [{
      data: productAnalytics?.categoryStats?.map(c => c.count) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      borderWidth: 2
    }]
  };

  // Visitors trend
  const visitorsData = {
    labels: dashboardStats?.analytics?.map(day => new Date(day.date).toLocaleDateString()) || [],
    datasets: [{
      label: 'Daily Visitors',
      data: dashboardStats?.analytics?.map(day => day.visitors) || [],
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h1 className="mb-4"><FiBarChart className="me-2" />Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-primary text-white rounded-circle p-3">
                  <FiPackage size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Products</h6>
                <h3 className="mb-0">{productAnalytics?.products?.length || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-success text-white rounded-circle p-3">
                  <FiTrendingUp size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Stock</h6>
                <h3 className="mb-0">
                  {productAnalytics?.categoryStats?.reduce((sum, cat) => sum + cat.totalStock, 0) || 0}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-info text-white rounded-circle p-3">
                  <FiUsers size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Visitors</h6>
                <h3 className="mb-0">{dashboardStats?.totalVisitors || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="bg-warning text-white rounded-circle p-3">
                  <FiBarChart size={24} />
                </div>
              </div>
              <div>
                <h6 className="text-muted mb-1">Page Views</h6>
                <h3 className="mb-0">{dashboardStats?.totalPageViews || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Product Stock Levels</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar data={stockData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Category Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie data={categoryData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Visitors Trend (Last 7 Days)</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line data={visitorsData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Product Stock Table */}
      <Row>
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Low Stock Alert</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productAnalytics?.products
                      ?.filter(product => product.stock <= 10)
                      ?.map(product => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>
                            <span className="badge bg-secondary">{product.category}</span>
                          </td>
                          <td>{product.stock}</td>
                          <td>${product.price}</td>
                          <td>
                            <span className={`badge ${product.stock === 0 ? 'bg-danger' : product.stock <= 5 ? 'bg-warning' : 'bg-info'}`}>
                              {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'Normal'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;