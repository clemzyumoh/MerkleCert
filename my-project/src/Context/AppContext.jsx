import { createContext, useContext, useState, useEffect } from "react";
import { getUserRole } from "../Services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateWallet = async (address) => {
    setWalletAddress(address);
    if (address) {
      setLoading(true);
      try {
        const data = await getUserRole(address);
        setRole(data.role || "user");
      } catch (err) {
        console.error("Failed to fetch user role", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        walletAddress,
        setWalletAddress: updateWallet,
        role,
        setRole,
        loading,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
