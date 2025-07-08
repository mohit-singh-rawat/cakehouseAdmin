import React, { useState } from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar bg="white" className="shadow-sm border-bottom px-3">
          <Button 
            variant="link" 
            className="text-dark p-0 me-3"
            onClick={toggleSidebar}
          >
            <FiMenu size={20} />
          </Button>
          
          <Navbar.Brand className="fw-bold text-primary">
            Negi Cake House - Admin
          </Navbar.Brand>
          
          <div className="ms-auto">
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              <FiLogOut className="me-2" />Logout
            </Button>
          </div>
        </Navbar>

        <main className="content-area">
          <Container fluid className="py-4">
            <div className="content-wrapper">
              {children}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Layout;