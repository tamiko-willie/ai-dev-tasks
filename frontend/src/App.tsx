import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InterviewCreation from './pages/InterviewCreation';
import InterviewSession from './pages/InterviewSession';
import Results from './pages/Results';

// Import components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import { SkipLink } from './components/accessibility/SkipLink';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <SkipLink />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interviews/create" element={<InterviewCreation />} />
              <Route path="/interviews/:id" element={<InterviewSession />} />
              <Route path="/interviews/:id/results" element={<Results />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App; 