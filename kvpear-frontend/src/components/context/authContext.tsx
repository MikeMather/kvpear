import { UserType } from "@/database/models/user";
import { useGet } from "@/utils/api";
import { PropsWithChildren, createContext, useEffect, useState } from "react";


export const authContext = createContext<{ 
  user: UserType | null, isLoading: boolean 
}>({ user: null, isLoading: true });

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const { get, isLoading, error } = useGet();
  const [user, setUser] = useState<UserType | null>(null);

  const getUser = async () => {
    const { data, isOk } = await get('/api/auth/me');
    if (isOk) {
      setUser(data);
    }
  }

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <authContext.Provider value={{ user, isLoading }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider;