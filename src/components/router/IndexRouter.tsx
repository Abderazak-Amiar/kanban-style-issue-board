import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Board from '../pages/Board';
import Login from '../pages/login';

const getHomePath = () => '/board';

const RequireAuth: React.FC<{
  children: React.ReactElement;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={getHomePath()} replace />;
  }
  return children;
};
// Prevents authenticated users from visiting public-only routes (e.g., login)
const PublicOnly: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to={getHomePath()} replace />;
  return children;
};
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        {/* Redirect root to /board */}
        <Route path="/" element={<Navigate to="/board" replace />} />

        {/* Single protected board for both roles */}
        <Route
          path="/board"
          element={
            <RequireAuth>
              <Board />
            </RequireAuth>
          }
        />
        {/* Backward-compat: redirect old role paths to /board */}
        <Route path="/admin" element={<Navigate to="/board" replace />} />
        <Route path="/contributor" element={<Navigate to="/board" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
