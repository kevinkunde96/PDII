import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
  data: {
    token: "",
    user_id: "",
    user_name: "",
    roleId: "",
  },
  setData: () => {},
});

export function UserProvider({ children }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if(auth) {
      setData(JSON.parse(auth))
    }
  }, [])

  return (
    <UserContext.Provider value={{ data, setData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
