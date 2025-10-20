import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Modal from '../moleculs/Modal';
import BoardPage from '../pages/Board';
import IssueDetail from '../pages/IssueDetail';
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

const PublicOnly: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to={getHomePath()} replace />;
  return children;
};

function RoutesWithModals() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  const navigate = useNavigate();

  return (
    <>
      {/* Render the normal routes, but if we came from a link that set backgroundLocation,
          use it so the underlying page stays visible */}
      <Routes location={state?.backgroundLocation || location}>
        {/* Public */}
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

        {/* Private board */}
        <Route
          path="/board"
          element={
            <RequireAuth>
              <BoardPage />
            </RequireAuth>
          }
        />

        {/* Full-page fallback if someone hits the detail URL directly (no backgroundLocation) */}
        <Route
          path="/issue/:id"
          element={
            <RequireAuth>
              <IssueDetail />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>

      {/* If we have a background page, render the IssueDetail as a modal on top */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/issue/:id"
            element={
              <RequireAuth>
                <Modal onClose={() => navigate(-1)}>
                  <IssueDetail />
                </Modal>
              </RequireAuth>
            }
          />
        </Routes>
      )}
    </>
  );
}

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <RoutesWithModals />
    </BrowserRouter>
  );
};

export default AppRouter;
