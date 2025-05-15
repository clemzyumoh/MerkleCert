


// App.jsx
import { useState, useEffect, useLocation } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./Components/SideBar";
import Home from "./Sections/Home/Dashboard";
import Upload from "./Sections/Upload/upload";
import View from "./Sections/View/verify";
import Settings from "./Sections/Setting/Setting";
import Header from "./Components/Header";
import Navigation from "./Components/Navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppContext } from "./Context/AppContext"; // <-- make sure this path is correct
import { Toaster } from "react-hot-toast";


import "./index.css";




const App = () => {
  
  const { publicKey, connected } = useWallet();
  const { setWalletAddress } = useAppContext();

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    }
  }, [connected, publicKey]);


  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme !== "light");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <main className="overflow-x-hidden">
      <Toaster position="top-right" />
      <div className="flex relative lg:pl-72 w-full dark:bg-black bg-white text-black dark:text-gray-300 min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <div className="flex-2 md:flex-1">
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                  <Home darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
              </>
            }
          />

          <Route
            path="/upload"
            element={
              <>
                <Sidebar />
                <div className="flex-2 md:flex-1">
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                  <Upload darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
              </>
            }
          />

          <Route
            path="/view"
            element={
              <>
                <Sidebar />
                <div className="flex-2 md:flex-1">
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                  <View darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
              </>
            }
          />

          <Route
            path="/settings"
            element={
              <>
                <Sidebar />
                <div className="flex-2 md:flex-1">
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                  <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
              </>
            }
          />
        </Routes>
      </div>

      <div className="lg:hidden">
        {" "}
        <Navigation />{" "}
      </div>
    </main>
  );
};

export default App;
