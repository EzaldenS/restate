import React, { createContext, ReactNode, useContext } from "react";

import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: (params?: Record<string, string | number>) => Promise<void>;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    error,
    refetch: originalRefetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLogged = !!user;

  // Create a wrapper refetch function that works with optional parameters
  const refetch = async (params?: Record<string, string | number>) => {
    return originalRefetch(params || {});
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;