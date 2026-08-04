import { useEffect, useState, type ReactNode } from 'react';

import { AuthContext } from './AuthContext';
import { api, setUnauthorizedHandler } from '../services/api';

const LOCAL_STORAGE_KEYS = '@refund';

const loadUserFromLocalStorage = (): null | UserAPIResponse => {
  const user = localStorage.getItem(`${LOCAL_STORAGE_KEYS}:user`);
  const token = localStorage.getItem(`${LOCAL_STORAGE_KEYS}:token`);

  if (user && token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return {
      user: JSON.parse(user),
      token,
    };
  }

  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<null | UserAPIResponse>(
    loadUserFromLocalStorage,
  );

  function saveDataToLocalStorage(data: UserAPIResponse) {
    localStorage.setItem(
      `${LOCAL_STORAGE_KEYS}:user`,
      JSON.stringify(data.user),
    );

    localStorage.setItem(`${LOCAL_STORAGE_KEYS}:token`, data.token);

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setSession(data);
  }

  function removeUserFromLocalStorage() {
    setSession(null);
    localStorage.removeItem(`${LOCAL_STORAGE_KEYS}:user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEYS}:token`);
    delete api.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    setUnauthorizedHandler(() => {
      removeUserFromLocalStorage();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        saveDataToLocalStorage,
        removeUserFromLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
