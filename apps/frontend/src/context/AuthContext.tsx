import { createContext } from 'react';

type AuthContext = {
  session: null | UserAPIResponse;
  saveDataToLocalStorage: (data: UserAPIResponse) => void;
  removeUserFromLocalStorage: () => void;
};

export const AuthContext = createContext({} as AuthContext);
