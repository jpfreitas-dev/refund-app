import { BrowserRouter } from 'react-router';

import { Loading } from '../components/Loading';
import { AuthRoutes } from './AuthRoutes';
import { EmployeeRoutes } from './EmployeeRoutes';
import { ManagerRoutes } from './ManagerRoutes';

const isLoading = false; // Simulação de carregamento

const session = {
  user: {
    role: 'manager',
  },
};

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

export function Routes() {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <RoleBasedRoutes />
    </BrowserRouter>
  );
}
