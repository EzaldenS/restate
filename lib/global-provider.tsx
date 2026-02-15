import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { defaultFilters, FilterShape } from "../components/types";
import { account, getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: (params?: Record<string, string | number>) => Promise<void>;
  filters: FilterShape;
  setFilters: (filters: FilterShape) => void;
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
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
    skip: true, // Skip initial fetch to avoid guest user error
  });

  const isLogged = !!user;

  // Check for existing session on mount and fetch user if session exists
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to get current session - if it succeeds, user is logged in
        await account.getSession("current");
        // If session exists, fetch user data
        await originalRefetch({});
      } catch (sessionError) {
        // No active session - user is a guest, this is expected
        console.log("No active session, user is a guest");
      }
    };

    checkSession();
  }, []);

  // Create a wrapper refetch function that works with optional parameters
  const refetch = async (params?: Record<string, string | number>) => {
    return originalRefetch(params || {});
  };

  // Filter state management
  const [filters, setFilters] = useState<FilterShape>(() => {
    console.log(
      "GlobalProvider: Initializing filters with default values",
      defaultFilters,
    );
    return defaultFilters;
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  console.log("GlobalProvider: Current filters state", filters);
  console.log("GlobalProvider: showFilterModal state", showFilterModal);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        error,
        refetch,
        filters,
        setFilters,
        showFilterModal,
        setShowFilterModal,
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
