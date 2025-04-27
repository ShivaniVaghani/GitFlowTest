import React, { useContext, useState, useRef, useEffect } from "react";
import { FaBars, FaUsers } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import {
  RiHome6Line,
  RiMenuFill,
  RiGitBranchLine,
  RiTimeLine,
  RiFileTextLine,
} from "react-icons/ri";
import darkmodeImg from "../../assets/logo.png";
import lightmodeImg from "../../assets/Bluefield.png";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDatabase } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { SiAwsorganizations } from "react-icons/si";
import { MdOutlineSecurity, MdSupportAgent } from "react-icons/md";
import { TbAsset, TbListCheck } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { RxCross2, RxDashboard } from "react-icons/rx";
import { FaHistory } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import translations from "../common/Translations";
import ProtectedRoute from "../../ProtecedRoutes/ProtectedRoute";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const DashboardMenus = ({setShowNames=() => {}, showNames=false}) => {
  const { theme, langMode, userType } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const isTaskManage = ["/maptask" ,"/task-manage", "/organization"];
  const [screenSize, setScreenSize] = useState(false)

  const userDetail = JSON.parse(localStorage.getItem("userDetails")) || {};
  const isCustomerSupport = userDetail.canAccessCustomerSupport === true;


    useEffect(() => {
      const updateHeightScreenSize = () => {
          // Add 40px extra when content wraps
          if (window.innerWidth <= 1213) {
            setScreenSize(true)
                    }
          // Remove extra 40px when content fits
          else if (window.innerWidth > 1213) {
            setScreenSize(false);
          } else {
            setScreenSize(false);
          }
      };
      // Initial update
      updateHeightScreenSize();

      // Update on window resize
      window.addEventListener('resize', updateHeightScreenSize);

      // Cleanup
      return () => window.removeEventListener('resize', updateHeightScreenSize);
    }, []);

  // Check if all other privileges are false
  const otherPrivileges = [
    "canAddEditActivityTemplates",
    "canAddLabelsToActivityTemplates",
    "canAddEditUser",
    "canModifyGuidelines",
    "canCreateDashboard",
    "canAddEditLeaderboard",
    "canAccessAssetManagement",
    "canAccessSettings",
    "canAccessConfiguration",
    "canAccessTaskManager",
    "canAccessAccountHistory",
    "canAccessWorkflow",
    "canAccessWorklog",
    "canAccessSecurity",
    "canAccessStockManagement",
    "canAccessCustomerSupport",
    "canAccessReports",

  ];

  const hasOtherPrivileges = otherPrivileges.some(privilege => userDetail[privilege] === true);

  const menus = [
    {
      icon: (
        <RiHome6Line
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/dashboard",
      relatedPaths: ["/dashboard", "/activty-dashboard", "/powerbi-dashboard"],
      name: translations[langMode].dashboard,
      tooltip: translations[langMode].dashboardtolltip,
    },
    {
      icon: (
        <FaRegUser
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/all-users",
      relatedPaths: ["/all-users"],
      name: translations[langMode].userlist,
      tooltip: translations[langMode].usertooltip,
      // privilegesRequired: ["canAddEditUser"]

    },
    {
      icon: (
        <IoSettingsOutline
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/settings",
      relatedPaths: ["/settings"],
      name: translations[langMode].setting,
      tooltip: translations[langMode].setting,
      privilegesRequired : ["canAccessSettings"],
      isPermission:userDetail?.canAccessSettings
    },
    {
      icon: (
        <TbAsset
          className={`${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/asset",
      relatedPaths: ["/asset"],
      name: translations[langMode].asset,
      tooltip: translations[langMode].assettooltip,
      privilegesRequired: ["canAccessAssetManagement"],
      isPermission:userDetail?.canAccessAssetManagement

    },
    {
      icon: (
        <FiDatabase
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/configuration",
      relatedPaths: ["/configuration"],
      name: translations[langMode].config,
      tooltip: translations[langMode].configtooltip,
      // privilegesRequired: ["canAddLabelsToActivityTemplates"],
      privilegesRequired:["canAccessConfiguration"],
      isPermission: userDetail?.canAccessConfiguration

    },
    {
      icon: (
        <TbListCheck
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/maptask",
      relatedPaths: ["/maptask", "/task-manage"],
      name: translations[langMode].task,
      tooltip: translations[langMode].tasktooltip,
      privilegesRequired:['canAccessTaskManager'],
      isPermission: userDetail?.canAccessTaskManager
    },
    {
      icon: (
        <FaHistory
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/taskhistory",
      relatedPaths: ["/taskhistory"],
      name: translations[langMode].acchistory,
      tooltip: translations[langMode].historytooltip,
      privilegesRequired:['canAccessAccountHistory'],
      isPermission:userDetail?.canAccessAccountHistory
    },
    {
      icon: (
        <RiGitBranchLine
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/workflow",
      relatedPaths: ["/workflow"],
      name: translations[langMode].workflowe,
      tooltip: translations[langMode].workflowtooltip,
      privilegesRequired:['canAccessWorkflow'],
      isPermission:userDetail?.canAccessWorkflow
    },
    {
      icon: (
        <RiTimeLine
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/worklog",
      relatedPaths: ["/worklog"],
      name: translations[langMode].worklog,
      tooltip: translations[langMode].worklogtooltip,
      privilegesRequired:['canAccessWorklog'],
      isPermission:userDetail?.canAccessWorklog
    },
    {
      icon: (
        <MdOutlineSecurity
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/security",
      relatedPaths: ["/security"],
      name: translations[langMode].security,
      tooltip: translations[langMode].securitytooltip,
      privilegesRequired:['canAccessSecurity'],
      isPermission:userDetail?.canAccessSecurity
    },
    {
      icon: (
        <AiOutlineStock
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/stock-managment",
      relatedPaths: ["/stock-managment"],
      name: translations[langMode].stock,
      tooltip: translations[langMode].stocktoooltip,
      privilegesRequired:['canAccessStockManagement'],
      isPermission:userDetail?.canAccessStockManagement
    },
    {
      icon: <BiSupport size={20} className={theme} />,
      link: "/customer-support",
      relatedPaths: ["/customer-support"],
      name: translations[langMode].support,
      tooltip: translations[langMode].supporttooltip,
      privilegesRequired: ["canAccessCustomerSupport"],
      isPermission: userDetail.canAccessCustomerSupport
    },
  ];

  const customerSupport = [
    {
      icon: <BiSupport size={20} className={theme} />,
      link: "/customer-support",
      relatedPaths: ["/customer-support"],
      name: translations[langMode].support,
      tooltip: translations[langMode].supporttooltip,
      privilegesRequired: ["canAccessCustomerSupport"],
      isPermission: userDetail.canAccessCustomerSupport
    },
    {
      icon: (
        <FaHistory
          className={`  ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
          size={20}
        />
      ),
      link: "/taskhistory",
      relatedPaths: ["/taskhistory"],
      name: translations[langMode].acchistory,
      tooltip: translations[langMode].historytooltip,
      privilegesRequired : ["canAccessAccountHistory"],
      isPermission:userDetail?.canAccessAccountHistory
    },
  ];

  if (userType === "super_admin") {
    menus.push(
      {
        icon: (
          <RiFileTextLine
            className={`  ${theme === "dark"
              ? "dark-mode"
              : theme === "high-contrast"
                ? "high-contrast"
                : ""
              }`}
            size={20}
          />
        ),
        link: "/reports",
        relatedPaths: ["/reports"],
        name: translations[langMode].report,
        tooltip: translations[langMode].reportooltip,
        privilegesRequired : ["canAccessReports"],
        isPermission:userDetail?.canAccessReports
      },
      {
        icon: (
          <SiAwsorganizations
            className={`  ${theme === "dark"
              ? "dark-mode"
              : theme === "high-contrast"
                ? "high-contrast"
                : ""
              }`}
            size={20}
          />
        ),
        link: "/organization",
        relatedPaths: ["/organization"],
        name: translations[langMode].org,
        tooltip: translations[langMode].orgtooltip,
      },
      // {
      //   icon: (
      //     <MdSupportAgent
      //       className={`  ${theme === "dark"
      //         ? "dark-mode"
      //         : theme === "high-contrast"
      //           ? "high-contrast"
      //           : ""
      //         }`}
      //       size={20}
      //     />
      //   ),
      //   link: "/customer-support",
      //   relatedPaths: ["/customer-support"],
      //   name: translations[langMode].support,
      //   tooltip: translations[langMode].supporttooltip,
      // }
    );
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowNames(false);
      }
    };
    if (showNames) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNames]);


  const filteredMenus = isCustomerSupport && !hasOtherPrivileges
    ? customerSupport
    : userType === "super_admin"
      ? menus
      : menus.filter(menu =>
        !menu.privilegesRequired || menu.privilegesRequired.every(privilege => userDetail[privilege])
      );

  useEffect(() => {
    // Close the sidebar when the location changes
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <>
      {showNames && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-5  transition-all duration-300" />
      )}

      {/* Overlay for isSidebarOpen */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 transition-all duration-300" />
      )}

      <div
        ref={sidebarRef}
        className={`relative bg-[#EBF5FF]
          
          ${showNames
            ? "lg:w-[210px] opacity-100 h-full"
            : "lg:w-[45px] opacity-100 p-[11px]"
          }
          ${isSidebarOpen
            ? "w-[210px] opacity-100 h-[95vh] p-[11px]"
            : "w-0 opacity-100"} 
          ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""}
         ${theme === "dark" && showNames
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
          }`}>
     { screenSize &&  <div
          className={`relative flex items-center  transition-all origin-top-left duration-300 ease-in-out 
            ${showNames
              ? "lg:w-[200px] opacity-100 bg-[#EBF5FF] rounded-t-md"
              : "lg:w-[45px] opacity-100"}
            ${isSidebarOpen
              ? "w-[200px] opacity-100 bg-[#EBF5FF] rounded-t-md"
              : "w-0 opacity-100"} 
            ${theme === "dark"
              ? "dark-mode"
              : theme === "high-contrast"
                ? "high-contrast"
                : ""
            }`}
          style={{ zIndex: 8888,
            top: (isSidebarOpen || showNames) ?  "0px" : "63px",
            justifyContent:(isSidebarOpen || showNames) ?  "end" : "start",
            height: "30px",
            background: "transparent" }}>

          {/* Button for the Desktop screen */}


          {/* Button for the mobile screen */}

          <button
            className={`lg:hidden flex items-center px-3 py-3 ${theme === "dark" ? "dark-mode" : ""}`}
            onClick={() => setIsSidebarOpen((prev) => !prev)} // Toggle the sidebar open/close
          >
            {isSidebarOpen ? (
              <RxCross2 size={20} className={`${theme === "dark" ? "dark-mode" : ""} text-gray-700 ml-3`} />
            ) : (
              <RxDashboard size={20} className={`${theme === "dark" ? "dark-mode" : ""} text-gray-700`} />
             )}
          </button>
        </div>}
        <div
          className={`absolute top-10 left-0 z-50 h-full origin-top-left transition-all duration-300 ease-in-out 
            ${theme === "dark"
              ? "dark-mode"
              : theme === "high-contrast"
                ? "high-contrast"
                : ""} 
            ${showNames
              ? "lg:w-[210px] opacity-100 bg-[#EBF5FF]"
              : "lg:w-[45px] opacity-100"}
            ${isSidebarOpen
              ? "w-[210px] opacity-100 bg-[#EBF5FF] !h-[98.3vh] py-[25px] px-[10px]"
              : "w-0 opacity-100 pointer-events-none md:pointer-events-auto"}
              ${screenSize ? (!isSidebarOpen && !showNames) ? "hidden": "":""}
               `}
          style={{ zIndex: 8888 }} >
           {!isSidebarOpen && !showNames && (
            <div
              onClick={() => setShowNames(true)}
              className="flex items-center py-2 px-3 cursor-pointer "
            >
              <FaBars />
            </div>
          )}
         {/* {(showNames || isSidebarOpen) && <div className="flex items-center justify-center mb-[40px]">
            <Link to="/dashboard">
              {theme === "dark" ? (
                <div className="inline-flex gap-1">
                  <img
                    src={darkmodeImg}
                    alt="Logo"
                    className={`h-10 ${theme === "dark" ? "dark-mode-img" : ""
                      }`}
                  />
                  <span className="text-3xl font-semibold">Blufield</span>
                </div>
              ) : (
                <img src={lightmodeImg} alt="Logo" className={`h-10`} />
              )}
            </Link>
          </div>} */}

          {filteredMenus.map((menu, index) => (
            <div
            key={index}
            className={` ${theme === "dark" ? "dark-mode " : "light-mode"
            } ${menu.isPermission === false ? "hidden" : ""}  relative group text-[#111827]`}
            title={(!showNames && !isSidebarOpen) ? menu?.name : ""}
            >
              <Link
                to={menu.link}
                className={classNames(
                  "flex items-center py-2 px-3 text-sm justify-left transition-all duration-300 transform hover:scale-110 hover:text-blue-600",
                  location.pathname === menu.link ||
                    menu.relatedPaths.includes(location.pathname)
                    ? "bg-[#236DB4] rounded-[8px] text-white"
                    : "",
                  isSidebarOpen ? location.pathname === menu.link ||
                    menu.relatedPaths.includes(location.pathname)
                    ? "bg-[#236DB4] rounded-[8px]"
                    : "" : "",
                  showNames ? "mx-3 py-3 hover:text-blue-600" : ""
                )}
                 >

                {menu.icon}

                {showNames && (
                  <span
                    className={`ml-3 text-sm font-medium ${location.pathname === menu.link ||
                      menu.relatedPaths.includes(location.pathname)
                      ? "text-white"
                      : ""
                      }`}  >
                    {menu.name}
                  </span>
                )}

                {isSidebarOpen && (
                  <span
                    className={`ml-3 text-sm font-medium 
                      ${location.pathname === menu.link ||
                        menu.relatedPaths.includes(location.pathname)
                        ? "text-white"
                        : ""
                      }`}  >
                    {menu.name}
                  </span>
                )}

              </Link>
              {/* <div
                id={`tooltip-${index}`}
                role="tooltip"
                className={`absolute left-14 top-10 text-nowrap inline-block px-3 py-2 text-sm font-medium text-white
          transition-all duration-300 bg-gray-900  opacity-0 transform scale-95 group-hover:opacity-100
          group-hover:scale-100 pointer-events-none ${showNames ? "left-52 top-0" : ""
                  }`}  >
                {menu.tooltip}
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div> */}
            </div>
          ))}
        </div>
      </div >
    </>
  );
};
export default DashboardMenus;
