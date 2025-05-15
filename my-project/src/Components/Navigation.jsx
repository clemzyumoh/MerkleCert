


import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {  FaEye, FaCog } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { IoHomeOutline } from "react-icons/io5";



const Navigation = () => {
  const location = useLocation();
  
  

  

//const { latestDocId } = useDocument();

  const Menus = [
    { to: "/", label: "Home", icon: <IoHomeOutline className="text-2xl" /> },
    {
      to: "/upload",
      label: "Upload",
      icon: <HiOutlineUpload className="text-2xl" />,
    },
    // {
    //   to: `/view/${latestDocId}`,
    //   label: "View",
    //   icon: <FaEye className="text-2xl" />,
    // },
    {
      to: `/view`,
      label: "Verify",
      icon: <FaEye className="text-2xl" />,
      //disabled: !latestDocId,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <FaCog className="text-2xl" />,
    },
  ];

  const [active, setActive] = useState(0);
  const activeIndex = Menus.findIndex((menu) => menu.to === location.pathname);
  const [spanLeft, setSpanLeft] = useState("");

  useEffect(() => {
    if (activeIndex !== -1) {
      setActive(activeIndex);
      setSpanLeft(
        `calc(${(activeIndex + 0.5) * (100 / Menus.length)}% - 2rem)`
      );
    } else {
      setSpanLeft("unset");
    }
  }, [activeIndex]);

  return (
    <div className="dark:bg-gray-800 bg-neutral-200 shadow-2xl px-6 pb-1 rounded-t-3xl z-50 flex justify-between items-center text-black dark:text-white lg:hidden bottom-0 mt-10 w-full fixed">
      <ul className="grid grid-cols-4 relative w-full">
        {/* Active icon semicircle */}
        <span
          className="dark:bg-gray-800 bg-neutral-200 duration-500 dark:shadow-lg w-16 h-9 absolute -top-5 rounded-t-full"
          style={{
            left: spanLeft,
            opacity: activeIndex === -1 ? 0 : 1,
          }}></span>

        {Menus.map((menu, index) => (
         
          <NavLink
            key={menu.label}
            to={menu.to}
            onClick={(e) => {
              if (menu.disabled) {
                e.preventDefault(); // stop navigation
                alert("No document to view yet.");
                return;
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full">
            <li
              className="flex flex-col items-center pt-6 relative"
              onClick={() => {
                if (!menu.disabled) setActive(index);
              }}>
              <span
                className={`text-xl z-10 duration-300 ${
                  index === active
                    ? "-mt-9 dark:text-indigo-600 text-indigo-600 border-2 border-indigo-600 p-2 rounded-full shadow-md"
                    : menu.disabled
                    ? "text-gray-300"
                    : "text-gray-400"
                }`}>
                {menu.icon}
              </span>
              <span
                className={`text-xs font-semibold mt-1 transition-all duration-300 ${
                  index === active
                    ? "opacity-100 translate-y-2 text-4xl text-indigo-600 dark:text-[#ffffff]"
                    : "opacity-0 translate-y-4"
                }`}>
                {menu.label}
              </span>
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
