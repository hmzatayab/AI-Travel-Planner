import { createContext, useContext, useState, useEffect } from "react";
import { saveUser, getUser, removeUser } from "@/utils/storage";

const UserDataContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (user) {
      saveUser(user);
    } else {
      removeUser();
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
