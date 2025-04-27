import React, { useContext } from "react";
import { MainNav } from "./MainNav";
import { AppContext } from "../../context/AppContext";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import HeaderNavBar from "./HeaderNavbar"

export const Layout = ({ children }) => {
  const { theme } = useContext(AppContext);
  const location = useLocation();
  const isMapTaskPage = location.pathname === "/maptask";
  const isTaskManagePage = location.pathname === "/task-manage";
  const isAddUser = location.pathname === "/add-user";
  const isConfiguration = location.pathname === "/configuration";

  return (
    <div
      className={` ${isMapTaskPage ? "" : "min-h-screen"} ${
        theme === "dark"
          ? "dark-mode"
          : theme === "high-contrast"
          ? "high-contrast"
          : theme === "light" && "bg-gray-50 "
      } flex h-screen bg-gray-100 w-full ${isTaskManagePage ? "overflow-hidden" : ""}`}
    >
      <HeaderNavBar />
      {/* {!isTaskManage.includes(location.pathname) && location.pathname !== "/workflow-form" && <MainNav />} */}
      <div
        className={` ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : theme === "light" && "bg-gray-50 "
          } flex  flex-col flex-1`}
        style={{
          width: "calc(100% - 200px)"
        }}
      >
        {/* {location.pathname !== "/workflow-form" && <HeaderNavBar />} */}
        {/* {isTaskManage.includes(location.pathname) && <MainNav />} */}
        <MainNav />
        <main
          className={`bg-white h-full rounded-[16px] m-[14px] mt-0 ${
            theme === "dark"
              ? "dark-mode"
              : theme === "high-contrast"
              ? "high-contrast"
              : theme === "light" && ""
          } ${isMapTaskPage ? "overflow-hidden" : ""}`}
        >
          <div
            className={`bg-white ${
              theme === "dark"
                ? "dark-mode"
                : theme === "high-contrast"
                ? "high-contrast"
                : theme === "light" && ""
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
