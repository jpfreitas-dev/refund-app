import { useState, type ReactNode } from 'react';

import { AuthContext } from './AuthContext';

const LOCAL_STORAGE_KEYS = '@refund';

const loadUserFromLocalStorage = (): null | UserAPIResponse => {
  const user = localStorage.getItem(`${LOCAL_STORAGE_KEYS}:user`);
  const token = localStorage.getItem(`${LOCAL_STORAGE_KEYS}:token`);

  if (user && token) {
    return {
      user: JSON.parse(user),
      token: JSON.parse(token),
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

    localStorage.setItem(
      `${LOCAL_STORAGE_KEYS}:token`,
      JSON.stringify(data.token),
    );
    setSession(data);
  }

  function removeUserFromLocalStorage() {
    setSession(null);
    localStorage.removeItem(`${LOCAL_STORAGE_KEYS}:user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEYS}:token`);

    window.location.assign('/');
  }

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
