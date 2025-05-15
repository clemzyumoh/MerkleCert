
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";







// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAppContext } from "../../Context/AppContext";


const Settings = ({ darkMode, setDarkMode }) => {
  const { publicKey, connected, connect, disconnect } = useWallet();
  //const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const { role, setRole } = useAppContext();

  
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (connected && publicKey) {
  //     // Logic for detecting user/admin roles based on wallet address
  //    if (publicKey.toString() === process.env.REACT_APP_ADMIN_WALLET) {
  //      setRole("admin");
  //    } else {
  //      setRole("user");
  //    }

  //   }
  // }, [connected, publicKey]);


  const handleConnect = () => {
    if (!connected) {
      connect();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="p-4 mt-20 flex flex-col justify-center gap-8 lg:px-20 items-center 0 w-[100vw] lg:w-[70vw] ">
      <h1 className="text-2xl ">Settings</h1>
      <div className="flex justify-between items-center w-full  md:w-1/2">
        <p className="text-lg">Dark Mode</p>
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          animate={{ rotate: darkMode ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => setDarkMode(!darkMode)}
          className="w-[24px]">
          {darkMode ? (
            <Sun size={24} className="dark:text-indigo-400" />
          ) : (
            <Moon size={24} className="text-[#1F1619]" />
          )}
        </motion.button>
      </div>

      <div className="mt-6 flex justify-center text-sm  items-center w-full md:w-1/2">
    
          <h2 className=" w-full md:mr-20 lg:text-lg ">Role Management</h2>
    
        
          <p className=" w-full lg:text-lg">
            Current Role:{" "}
            <span className="font-bold text-md">{role || "Loading..."}</span>
          </p>
      
      </div>

      <div className="mt-6 flex flex-col justify-center items-center w-full">
        <h2 className="text-lg  ">Wallet Connection</h2>
        <div className="mt-2 flex flex-col items-center justify-center">
          {connected ? (
            <>
              <p className="text-[12px] my-8">Connected: {publicKey.toString()}</p>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 mt-2 bg-red-600  text-white rounded-md hover:bg-red-500">
                Disconnect
              </button>
            </>
          ) : (
            // <button
            //   onClick={handleConnect}
            //   className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
            //   Connect Wallet
            // </button>
            <WalletMultiButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
