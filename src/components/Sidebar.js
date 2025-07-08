import React from 'react';
import { Nav, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FiHome, FiPackage, FiMessageSquare, FiBarChart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/complaints', icon: FiMessageSquare, label: 'Complaints' },
    { path: '/analytics', icon: FiBarChart, label: 'Analytics' },
  ];

  const renderNavItem = (item) => {
    const { path, icon: Icon, label } = item;
    
    if (isOpen) {
      return (
        <LinkContainer to={path} key={path}>
          <Nav.Link className="sidebar-link">
            <Icon className="sidebar-icon" />
            <span className="sidebar-text">{label}</span>
          </Nav.Link>
        </LinkContainer>
      );
    } else {
      return (
        <OverlayTrigger
          key={path}
          placement="right"
          overlay={<Tooltip>{label}</Tooltip>}
        >
          <div>
            <LinkContainer to={path}>
              <Nav.Link className="sidebar-link sidebar-link-collapsed">
                <Icon className="sidebar-icon" />
              </Nav.Link>
            </LinkContainer>
          </div>
        </OverlayTrigger>
      );
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          {isOpen ? (
            <>
              <h5 className="text-white mb-0">🍰 Admin</h5>
              <Button 
                variant="link" 
                className="text-white p-0 sidebar-toggle"
                onClick={toggleSidebar}
              >
                <FiChevronLeft size={18} />
              </Button>
            </>
          ) : (
            <div className="text-center w-100">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Expand Sidebar</Tooltip>}
              >
                <Button 
                  variant="link" 
                  className="text-white p-0 sidebar-toggle"
                  onClick={toggleSidebar}
                >
                  <FiChevronRight size={18} />
                </Button>
              </OverlayTrigger>
            </div>
          )}
        </div>
        
        <Nav className="flex-column sidebar-nav">
          {menuItems.map(renderNavItem)}
        </Nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && window.innerWidth <= 991 && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;