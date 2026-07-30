import { BrowserRouter } from 'react-router';

import { useAuth } from '../hooks/useAuth';

import { AuthRoutes } from './AuthRoutes';
import { EmployeeRoutes } from './EmployeeRoutes';
import { ManagerRoutes } from './ManagerRoutes';

export function Routes() {
  const { session } = useAuth();

  function RoleBasedRoutes() {
    switch (session?.user.role) {
      case 'employee':
        return <EmployeeRoutes />;
      case 'manager':
        return <ManagerRoutes />;
      default:
        return <AuthRoutes />;
    }
  }

  return <BrowserRouter>{RoleBasedRoutes()}</BrowserRouter>;
}
