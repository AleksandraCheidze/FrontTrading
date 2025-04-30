import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Auth from './Auth';
import Home from '../Home/Home';

// This component decides whether to show Auth or Home based on the path
const AuthOrHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If we're at the root path, show Home, otherwise show Auth
  if (location.pathname === '/') {
    return <Home />;
  }

  // For all other auth-related paths, show Auth
  return <Auth />;
};

export default AuthOrHome;
