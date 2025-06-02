import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { AccessibleButton } from './accessibility/AccessibleButton';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav
        className="w-64 bg-indigo-800 text-white p-6"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">AI Interview Platform</h1>
        </div>

        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
              role="menuitem"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/interviews/create"
              className="block py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
              role="menuitem"
            >
              Create Interview
            </Link>
          </li>
        </ul>

        <div className="absolute bottom-0 left-0 w-64 p-6">
          <div className="mb-4">
            <p className="text-sm opacity-75">
              Signed in as: {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs opacity-75">{user?.email}</p>
          </div>
          <AccessibleButton
            onClick={handleLogout}
            variant="secondary"
            className="w-full"
            aria-label="Sign out of your account"
          >
            Sign Out
          </AccessibleButton>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto bg-gray-50 p-8"
        role="main"
        id="main-content"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 