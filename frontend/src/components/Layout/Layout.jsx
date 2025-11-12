import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 My Cloud. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;