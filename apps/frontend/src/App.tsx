import { AuthProvider } from './context/AuthProvider';

import { Routes } from './routes/Index';

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
