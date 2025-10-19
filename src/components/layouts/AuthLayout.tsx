import React from 'react';
import '../../styles/AuthLayout.css';
import type { AuthLayoutProps } from '../../types';

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">KANBAN STYLE ISSUE BOARD</h1>
          <p className="auth-subtitle">Manage your projects efficiently</p>
        </div>
        <div className="auth-content">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
