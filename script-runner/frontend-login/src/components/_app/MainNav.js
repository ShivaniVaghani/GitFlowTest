import React, { useContext, useEffect, useState, useRef, Fragment } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AppContext } from "../../context/AppContext";
import { IoIosNotifications, IoMdLogOut } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import dummyImg from "../../assets/dummy.webp";
import lightmodeImg from "../../assets/Bluefield.png";
import darkmodeImg from "../../assets/logo.png";
import OrganizationFilterSelect from "../common/task/OrganizationFilterSelect";
import ActivitySelect from "../common/task/ActivitySelect";
import { getUnreadMsgCount } from "../../service/Notification";
import Logout from "../common/Logout";
import LangComp from "./langComp";
import DashboardMenus from "./DashboardMenus.js";
import RcOrganization from "../common/task/RcOrganization.js";
import RcActivity from "../common/task/RcActivity.js";
import notification from "../../assets/notification03.png"
import logout from "../../assets/power.png"
import userProfile from "../../assets/user.png"
import { components } from 'react-select';
import { RxCross2 } from "react-icons/rx";
import { getAllByOrganizationId, getProjectListByDepartmentId } from "../../service/User.js";
import ReactSelector from "../common/CommonReactSelector.js";
import { Spinner } from "../../Spinner.js";
import { fetchData } from "../../service/workflow.js";
import { fetchTasks } from "../../service/Task.js";
import translations from "../common/Translations.js";

const Placeholder = (props) => {
  return <components.Placeholder {...props} />;
};
export const MainNav = () => {
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const context = useContext(AppContext);
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [department, setDepartment] = useState([])
  const [departmentsFetched, setDepartmentsFetched] = useState(false);
  const [project, setProject] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false); // State to track department selection
  const {
    theme,
    profilePic,
    setProfilePic,
    workflowName,
    setWorkflowName,
    selectedOrgId,
    setSelectedOrgId,
    setSelectedOrgName,
    selectedOrgName,
    setPriority,
    setActive,
    setSelectedUserId,
    setSelectedUserName,
    fetchNotifications,
    langMode
    , totalUnreadMsgCount, setTotalUnreadMsgCount, toggleLangMode,
    updateProjectId, updateDepartmentId, departmentId, projectId,setTaskData,setWorkflowId,updateActivityId
  } = context;
  const user = Cookies.get("userName");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"))

  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = () => {
    setActive("Status");
    setPriority("Priority");
    setSelectedUserId('')
    setSelectedUserName("Default")

  };

  // const isTaskManage = ["/maptask" ,"/task-manage", "/organization"];

  const isworkflowpage =
    location.pathname === "/workflow" ||
    location.pathname === "/asset" ||
    location.pathname === "/reports" ||
    location.pathname === "/all-users" ||
    location.pathname === "/taskhistory" ||
    location.pathname === "/security" ||
    location.pathname === "/createAccount" ||
    location.pathname === "/stock-managment" ||
    location.pathname === "/add-vehical" ||
    location.pathname === "/add-asset" ||
    location.pathname === "/export";
  const bothdropdonw =
    location.pathname === "/organization" ||
    location.pathname === "/notification" ||
    location.pathname === "/user-profile";
  useEffect(() => {
    const profilePic = Cookies.get("profilePic") || dummyImg;
    setProfilePic(profilePic !== "null" ? profilePic : dummyImg);
    const userTypeCookie = Cookies.get("userType");
    setUserType(userTypeCookie);
  }, []);

  useEffect(() => {
    const fetchUnreadMsgCount = async () => {
      try {
        const count = await getUnreadMsgCount();
        setTotalUnreadMsgCount(count.body.value.unreadMsgCount);
      } catch (error) {
        console.error("Failed to fetch unread message count:", error);
      }
    };
    fetchUnreadMsgCount();
  }, []);

  const handleLogout = () => setShowModal(true);
  const handleViewNotifications = () => {
    Cookies.set("notipreviousPath", location.pathname); // Store the current path in cookie
    navigate("/notification");
    setActive("Status");
    setPriority("Priority");
    setSelectedUserId('')
    setSelectedUserName("Default")
    // fetchNotifications(0)
  };
  const handleSettings = () => {
    navigate("/settings");
    handleReset();
  };

  const formatUserType = (userType) => {
    if (!userType) return "Unknown";
    switch (userType) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "office_user":
        return "Office User";
      default:
        return userType
          .replace(/_/g, " ")
          .replace(/^./, (str) => str.toUpperCase());
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavbarOpen(false);
      }
    };

    if (isNavbarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarOpen]);

  const userDetail = JSON.parse(localStorage.getItem("userDetails")) || {};
  const isCustomerSupport = userDetail.canAccessCustomerSupport === true;
  const isCustomerModule = location.pathname === "/customer-support"

  // Check if all other privileges are false
  const otherPrivileges = [
    "canAddEditActivityTemplates",
    "canAddLabelsToActivityTemplates",
    "canAddEditUser",
    "canModifyGuidelines",
    "canCreateDashboard",
    "canAddEditLeaderboard",
    "canAccessAssetManagement"
  ];

  const hasOtherPrivileges = otherPrivileges.some(privilege => userDetail[privilege] === true);

  const organizationId = localStorage.getItem("selectedOrgId")

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!organizationId) return; // Don't fetch if there's no organization selected
      try {
        const data = await getAllByOrganizationId(organizationId);
        setDepartment(data);
        setDepartmentsFetched(true)
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartmentsFetched(true);
      }
    };

    fetchDepartments(); // Trigger the department fetch whenever `userInfo.organization` changes
  }, [organizationId]);

  // department

  // Prepare department options
  const departmentOptions = Array.isArray(department)
    ? department.map((item) => ({ value: item.id, label: item.name }))
    : [];

  const defaultDepartment = departmentOptions.find((d) => d.value == departmentId);
  // Determine default value
  const handleDepartmentChange = async (selectedOption) => {
    try {
      const departmentId = selectedOption.value;
      console.log("Selected Department ID:", departmentId, selectedOption);
      if (departmentId) {
        const projects = await getProjectListByDepartmentId(departmentId);
        const data = await fetchTasks({ workflowIds: '', priority: "Priority", active: "Status", currentPage: 0, pageSize: 10 });
        setTaskData(data?.taskList || [])
        setWorkflowId(null)
        updateDepartmentId(selectedOption.value)
        updateActivityId(null)
        setProject(projects)
        setIsDepartmentSelected(true); // Set department as selected
        updateProjectId(null);
        localStorage.removeItem("activityId");
        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsDepartmentSelected(false); // Reset if there's an error
    }
  };

  const hasFetched = useRef(false); // To track if the API has already been called
  const fetchProjectList = async () => {
    try {
      if (departmentId) {
        const data = await getProjectListByDepartmentId(departmentId);
        setProject(data);
      } else {
        setProject([]); // Clear projects if departmentId is null
      }
    } catch (error) {
      setProject([]);
      console.error("Error fetching projects:", error);
    }
  };


  useEffect(() => {
    if (!departmentsFetched) return; // Don't run until departments are fetched
    if ((department || []).length === 0) {
      setProject([]);
      localStorage.removeItem("activityId");
  
      setTimeout(() => {
        updateActivityId(null);
      }, 300);
    }
  
    if ((department || []).length > 0 && departmentId && !hasFetched.current) {
      fetchProjectList();
      hasFetched.current = true;
    }
  }, [department, departmentId, departmentsFetched]);

  // project
  const options = (Object.values(project)?.flat() || [])?.map((item) => ({ "value": item.id, "label": item.name }))
  const defaultProject = options.find((p) => p.value == projectId);

  const handleProjectChange = async (selectedOption) => {
    try {
      const projectId = selectedOption?.value;
      console.log("Selected Project ID:", projectId);

      if (projectId) {
        updateProjectId(projectId)
        setIsDepartmentSelected(false)
        setTaskData([])
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Stop loading after delay
    }, 3000); // 3-second delay
  }, []);
  return (
    <>
      <Disclosure
        as="nav"
        ref={navbarRef}
        className={`bg-white w-full shadow-none ${theme === "dark" ? "dark-mode" : ""
          }`}
      >
        {({ open }) => (
          <>
            <div className={`w-full px-4 sm:pr-0 sm:px-6 lg:px-8`}>
              <div className="flex h-16 space-x-10 lg:space-x-0 justify-between items-center">

                {/* Add DashboardMenus to the MainNav */}

                <div
                  className={`lg:hidden block fixed top-1 left-0 z-50`}
                >
                  <DashboardMenus /> {/* Sidebar content */}
                </div>

                {/* LOGO part for BLUFIELD */}

                {/* {!isTaskManage.includes(location.pathname) && <div className="flex items-center">
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

                <Link to="/dashboard">
                  {theme === "dark" ? (
                    <div className="inline-flex gap-1">
                      <img
                        src={darkmodeImg}
                        alt="Logo"
                        className={`h-10 ${theme === "dark" ? "dark-mode-img" : ""
                          }`}
                      />
                    </div>
                  ) : (
                    <img src={lightmodeImg} alt="Logo" className={`h-10`} />
                  )}
                </Link>

                <div className="hidden lg:flex md:items-center gap-1 w-full justify-end">
                  {isLoading ? (
                    <Spinner /> // Loading state while waiting
                  ) : (
                    !isCustomerModule &&
                    <div className="flex justify-end gap-2 w-full mr-2">
                      <div className={`${selectedOptions.length <= 1 ? "w-[219px]" : "w-auto"}`}>

                        <ReactSelector
                          defaultValue={defaultDepartment}
                          options={departmentOptions}
                          components={Placeholder}
                          placeholder={departmentOptions.length > 0 ? 'select deparment' : 'No deparment'}
                          onChange={handleDepartmentChange}
                          height="38px"
                        />

                      </div>
                      <div className="max-w-[212px] w-full">
                        <ReactSelector
                          defaultValue={defaultProject}
                          options={options}
                          components={Placeholder}
                          // placeholder={options.length > 0 ? 'select project' :'No project'}
                          placeholder={(isDepartmentSelected || departmentId) ? (options.length > 0 ? 'select project' : 'No project') : 'No project'}
                          onChange={handleProjectChange}
                          height="38px"
                        // isDisabled={userDetails.userType !== "super_admin"}
                        />
                      </div>
                    </div>
                  )}
                  {/* {isCustomerSupport && !hasOtherPrivileges ? (
                        <>
                    <RcOrganization/>
                    <RcActivity/>
                        </>
                      ) : ( */}
                  <>
                    {!bothdropdonw && (
                      <>
                        {" "}
                        {/* {userType === "super_admin"  && (
                            <OrganizationFilterSelect
                              selectedOrgName={selectedOrgName}
                              setSelectedOrgId={setSelectedOrgId}
                              setSelectedOrgName={setSelectedOrgName}
                              setWorkflowName={setWorkflowName}
                            />
                          )}
                          {!isworkflowpage  && (
                            <ActivitySelect
                              setWorkflowName={setWorkflowName}
                              workflowName={workflowName}
                              selectedOrgId={selectedOrgId}
                            />
                          )}
                          <LangComp
                            toggleLangMode={toggleLangMode}
                            isNavbarOpen={isNavbarOpen}
                          /> */}

                      </>
                    )}</>
                  {/* )} */}

                  <div className="flex items-center justify-end w-full max-w-fit gap-4 ml-2">
                    <div
                      className="relative group w-[44px] h-[44px] rounded-full bg-[#EBECEF] cursor-pointer"
                      onClick={handleViewNotifications}
                    >
                      {/* Notification Icon */}
                      <img
                        src={notification}
                        alt="Notifications"
                        className="absolute top-[11px] left-[11px] h-[22px] w-[22px] filter brightness-75 group-hover:brightness-100"
                      />

                      {/* Unread Count Badge */}
                     
                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[#EF4A00] text-white text-xs font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-md">
                          {totalUnreadMsgCount}
                        </span>
                    

                      {/* Tooltip */}
                      <div
                        role="tooltip"
                        className="absolute right-full top-1/2 -translate-y-1/2 mr-2 z-10 invisible px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100"
                      >
                        Notification
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </div>

                      <LangComp toggleLangMode={toggleLangMode} isNavbarOpen={isNavbarOpen}/>
                    <div className="relative ">
                      <img
                        className={`w-10 h-10 p-1 rounded-full cursor-pointer ring-2 ring-gray-300 ${theme === "dark"
                          ? "bg-white"
                          : theme === "high-contrast"
                            ? "bg-white"
                            : ""
                          }`}
                        src={profilePic}
                        alt="Avatar"
                        onClick={() => {
                          Cookies.set("previousPath", location.pathname); // Store the current path in cookies
                          // navigate("/user-profile"); // Navigate to the user profile path
                          setShowProfileModal(!showProfileModal)
                          setActive("Status")
                          setPriority("Priority")
                          setSelectedUserId('')
                          setSelectedUserName("Default")
                        }}
                      />
                      {/* <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border border-white" /> */}
                    </div>
                    {/* <div className="text-sm">
                      <span className="font-bold">{user}</span>
                      <span
                        className={`block text-gray-700 ${theme === "dark"
                          ? "dark-mode "
                          : theme === "high-contrast"
                            ? "  "
                            : ""
                          }`}
                      >
                        {formatUserType(userType)}
                      </span>
                    </div> */}



                    {/* <div
                      className="relative group seting"
                      onClick={handleSettings}
                    >
                      <IoSettings className=" h-7 w-7 filter brightness-75 hover:text-blue-500" />
                      <div
                        role="tooltip"
                        className="absolute right-full ml-2 z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:visible group-hover:opacity-100"
                      >
                        Settings
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </div> */}
                    {/* <div className="relative group" onClick={handleLogout}>
                      <IoMdLogOut className="h-7 w-7 filter brightness-75 hover:text-blue-500" />
                      <div
                        role="tooltip"
                        className="absolute right-full  ml-2 z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:visible group-hover:opacity-100"
                      >
                        Logout
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* This part is for the Hamburger Icon button and it's styling */}

                <div className="lg:hidden inline-flex items-center gap-4 justify-center">
                  <Disclosure.Button
                    onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                    className="inline-flex items-center justify-center p-2 text-gray-400  hover:text-red-600"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isNavbarOpen ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>

              </div>
            </div>

            <Disclosure.Panel
              className={`lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end overflow-hidden transition-all duration-300 ease-in-out max-h-0
              ${isNavbarOpen ? "max-h-screen overflow-auto border-l" : "max-h-0"}`}
              static
            >
              <div className="absolute right-0 h-full w-64 bg-white shadow-lg">

                <div className="p-5 flex flex-col gap-4 justify-center">

                  <button
                    onClick={() => setIsNavbarOpen(false)}
                    className="self-end p-2 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  {isCustomerSupport && !hasOtherPrivileges ? (
                    <>
                      <RcOrganization />
                      <RcActivity />
                    </>
                  ) : (
                    <>
                      {!bothdropdonw && (
                        <>
                          {" "}
                          {/* {userType === "super_admin" && ( */}
                          <OrganizationFilterSelect
                            selectedOrgName={selectedOrgName}
                            setSelectedOrgId={setSelectedOrgId}
                            setSelectedOrgName={setSelectedOrgName}
                            setWorkflowName={setWorkflowName}
                          />
                          {/* )} */}
                          {/* {!isworkflowpage  && ( */}
                          {/* // <ActivitySelect
                                //   setWorkflowName={setWorkflowName}
                                //   workflowName={workflowName}
                                //   selectedOrgId={selectedOrgId}
                                // /> */}
                          {isLoading ? (
                            <Spinner /> // Loading state while waiting
                          ) : (<>
                            <ReactSelector
                              defaultValue={defaultDepartment}
                              options={departmentOptions}
                              components={Placeholder}
                              placeholder={departmentOptions.length > 0 ? 'select deparment' : 'No deparment'}
                              onChange={handleDepartmentChange}
                              height="38px"
                            />

                            <ReactSelector
                              defaultValue={defaultProject}
                              options={options}
                              components={Placeholder}
                              // placeholder={options.length > 0 ? 'select project' : 'No project'}
                              placeholder={(isDepartmentSelected && departmentId) ? (options.length > 0 ? 'select project' : 'No project') : 'No project'}
                              onChange={handleProjectChange}
                              height="38px"
                            />
                          </>)}
                          {/* // )} */}
                          <LangComp
                            toggleLangMode={toggleLangMode}
                            isNavbarOpen={isNavbarOpen}
                          />

                        </>
                      )}</>
                  )}


                  <div className="mt-3 flex flex-col gap-4 ">

                    {/* Profile Picture Section */}

                    <div className="flex flex-row space-x-5" >
                      <div className="relative" >
                        <img
                          className={`w-10 h-10  p-1 rounded-full cursor-pointer ring-2 ring-gray-30 ${theme === "dark"
                            ? "bg-white"
                            : theme === "high-contrast"
                              ? "bg-white"
                              : ""
                            }`}
                          src={profilePic}
                          alt="Avatar"
                          onClick={() => {
                            Cookies.set("previousPath", location.pathname); // Store the current path in cookies
                            navigate("/user-profile"); // Navigate to the user profile path
                            setActive("Status")
                            setPriority("Priority")
                            setSelectedUserId('')
                            setSelectedUserName("Default")
                          }}
                        />
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border border-white" />
                      </div>

                      <div className="">
                        <span
                          className={` ${theme === "dark"
                            ? "dark-mode "
                            : theme === "high-contrast"
                              ? "high-contrast  "
                              : ""
                            } font-bold text-sm`}
                        >
                          {user}
                        </span>
                        <span
                          className={`block text-gray-700 text-xs  ${theme === "dark"
                            ? "dark-mode "
                            : theme === "high-contrast"
                              ? "  "
                              : ""
                            }`}
                        >
                          {formatUserType(userType)}
                        </span>
                      </div>

                    </div>

                    {/* Notifications */}

                    <div
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={handleViewNotifications}
                    >
                      <IoIosNotifications className="h-6 w-6 text-gray-600" />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Notifications</span>
                        <span className="text-xs text-gray-500">
                          {totalUnreadMsgCount} unread
                        </span>
                      </div>

                    </div>

                    <div
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={handleSettings}
                    >
                      <IoSettings className="h-6 w-6 text-gray-600" />
                      <span className="text-sm font-medium">Settings</span>
                    </div>

                    {/* Logout */}
                    <div
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={handleLogout}
                    >
                      <IoMdLogOut className="h-6 w-6 text-gray-600" />
                      <span className="text-sm font-medium">Logout</span>
                    </div>

                  </div>
                </div>

              </div>

            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Transition.Root show={showProfileModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowProfileModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50" />
          </Transition.Child>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`absolute transform rounded-lg shadow-xl bg-white flex flex-col gap-[16px] !max-w-[312px] !w-full h-auto !top-[7%] ${langMode ==='ar' ? '!left-[2%]' :'!right-[2%]'} py-[12px] px-[16px]`} >
                <div className=" flex flex-col gap-[3px]"
                  style={{
                    background: "linear-gradient(90deg, #E7F9FF 0%, #F2F7FD 100%)",
                    padding: "12px 16px",
                    borderRadius: "8px"
                  }}>
                  <div className="flex justify-between w-full">
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600"
                      }}
                      className={` ${theme === "dark"
                        ? "dark-mode "
                        : theme === "high-contrast"
                          ? "high-contrast  "
                          : ""
                        } font-bold text-sm`}
                    >
                      {user}
                    </span>
                    <button
                      type="button"
                      className="text-gray-600 transition-transform transform hover:scale-110"
                      onClick={() => setShowProfileModal(!showProfileModal)}
                    >
                      <RxCross2 className="h-6 w-6" />
                    </button>
                  </div>
                  <span
                    style={{
                      textAlign: "start",
                     
                    }}
                    className={`block text-gray-700 text-xs font-medium  ${theme === "dark"
                      ? "dark-mode "
                      : theme === "high-contrast"
                        ? "  "
                        : ""
                      }`}
                  >
                    {formatUserType(userType)}
                  </span>
                </div>

                {/* {userType === "super_admin" && ( */}
                <OrganizationFilterSelect
                  selectedOrgName={selectedOrgName}
                  setSelectedOrgId={setSelectedOrgId}
                  setSelectedOrgName={setSelectedOrgName}
                  setWorkflowName={setWorkflowName}
                  width="full"
                />
                {/* )} */}
                <div className="relative group flex gap-[10px] cursor-pointer" onClick={() => { navigate("/user-profile"); setTimeout(() => setShowProfileModal(false), 100) }}>
                  {/* <IoMdLogOut className="h-7 w-7 filter brightness-75 hover:text-blue-500" /> */}
                  <img src={userProfile} className="filter brightness-75 hover:text-blue-500" />
                  <div className="text-[#111827] text-base font-normal hover:text-[#4B5563]">
                   {translations[langMode].myprofile}
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>

                <div className="relative group flex gap-[10px] cursor-pointer" onClick={handleLogout}>
                  {/* <IoMdLogOut className="h-7 w-7 filter brightness-75 hover:text-blue-500" /> */}
                  <img src={logout} className="filter brightness-75 hover:text-blue-500" />
                  <div
                    // role="tooltip"
                    className="text-[#111827] font-normal text-base hover:text-[#4B5563]"
                  >
                    Log Out
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>


              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Logout setShowModal={setShowModal} showModal={showModal} isNavbarOpen={isNavbarOpen} />
    </>
  );
};
