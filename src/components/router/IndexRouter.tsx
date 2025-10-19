import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { default as AdminBoard } from '../pages/AdminBoard';
import ContributorBoard from '../pages/ContributorBoard';
import Login from '../pages/login';

const getHomePath = (role?: string | null) =>
  role === 'admin' ? '/admin' : '/contributor';

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
    // Send users to their role home instead of looping on "/"
    return <Navigate to={getHomePath(role)} replace />;
  }

  return children;
};

// Prevents authenticated users from visiting public-only routes (e.g., login)
const PublicOnly: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, role } = useAuthStore();
  if (isAuthenticated) return <Navigate to={getHomePath(role)} replace />;
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

        {/* Redirect root to contributor */}
        <Route path="/" element={<Navigate to="/contributor" replace />} />

        {/* Contributor home */}
        <Route
          path="/contributor"
          element={
            <RequireAuth allowedRoles={['contributor']}>
              <ContributorBoard />
            </RequireAuth>
          }
        />

        {/* Admin home (distinct path) */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={['admin']}>
              <AdminBoard />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/contributor" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
