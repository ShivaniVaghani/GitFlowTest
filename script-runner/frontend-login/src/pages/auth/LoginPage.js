import React, { useContext, useState, useEffect, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Cookies from "js-cookie";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import OtpVerification from "./OtpVerification";
import ResetPasswordPage from "./ResetPasswordPage";

// 🌟 Pull in the context object via the named export:
import { AppContext } from "../../context/AppContext";

import { generateToken } from "../../Push_notification/Notification";
import { loginUser, storeFcmToken, forgotPassword } from "../../service/AuthService";
import { RiLoader3Fill } from "react-icons/ri";

import logo from "./../../assets/Bluefield.png";
import loginImage from "./../../assets/loginImage.png";
import LangComp from "../../components/_app/LangComp";
import translations from "../../components/common/Translations";

const registrationSchema = Yup.object().shape({
  // email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(2, "Password must be at least 8 characters")
    .required("Password is required"),
});

const languageData = [
  { id: 1, lang: "en", langText: "English" },
    { id: 2, lang: "ur", langText: "Urdu" },
    { id: 3, lang: "ar", langText: "Arabic" },
]
const LoginPage = () => {


  const { user, setUser, theme, fetchNotifications , toggleLangMode, langMode} = useContext(AppContext);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
 const navbarRef = useRef(null);
 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleForgotPasswordMode = () => {
    setForgotPasswordMode(!forgotPasswordMode);
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const responseData = await loginUser(values);
      const rememberCheckbox = document.getElementById("remember");
      const isChecked = rememberCheckbox.checked;
      if (isChecked) {
        window.localStorage.setItem("isLoggedIn", true);
      }

      if (responseData.header.code === 600) {
        const userDetails = responseData.body.value.userDetails;
        setUser(userDetails);
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        localStorage.setItem("justLoggedIn", "true");
        setLoading(false);
        const { accessToken } = responseData.body.value;
        localStorage.setItem("accessToken", accessToken);

        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 60 * 60 * 1000);
        Cookies.set("accessToken", accessToken, { expires });
        Cookies.set("userType", userDetails.userType, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("userId", userDetails.userId);
        Cookies.set("userName", userDetails.name);
        Cookies.set("userVisibility", userDetails.userVisibility);
        Cookies.set("userEmail", userDetails.email, { httpOnly: true });
        Cookies.set("profilePic", userDetails.profilePic);
        Cookies.set("firstTimeLogin", userDetails.firstTimeLogin);

        const userDetail = JSON.parse(localStorage.getItem("userDetails")) || {};
        const isCustomerSupport = userDetail.canAccessCustomerSupport === true;
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

        // Fetch user access menu/pages
        const userMenu = userDetails?.allowedPages || []; // Assuming this comes from API

        // Determine the first accessible page
        let defaultRoute = "/dashboard"; // Fallback if no menu found
        if (userMenu.length > 0) {
          defaultRoute = userMenu[0]; // Redirect to the first page in the list
        }

        // Redirect to the correct page
        isCustomerSupport  && !hasOtherPrivileges ? navigate("/customer-support") : navigate(defaultRoute);

        toast.success(
          `${userDetails.firstTimeLogin === "false" ? "Welcome Back " : "Welcome"} ${userDetails.name}`
        );

        // Handle Push Notification Token
        const token = await generateToken();
        await storeFcmToken(token, accessToken);
        fetchNotifications(0);
      } else if (responseData.header.code === 612) {
        toast.error("Email id or password wrong");
        setLoading(false);
      } else if (responseData.header.code === 613) {
        setResetEmail(values.email);
        setResetPassword(true);
      } else if (responseData.header.code === 608) {
        toast.error("Access Denied");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };


  const handleForgotPassword = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const responseData = await forgotPassword(values.email);
      if (responseData.header.code === 600) {
        setResetEmail(values.email);
        toast.success("Check your email for OTP");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
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
  return (
    <>
      {!resetEmail && !resetPassword && (
        <div className="flex justify-center items-center h-screen"
        style={{
          // padding : "40px 32px",
          background: "radial-gradient(#1E429F33, #FFFFFF)"
        }}>
           <div className="w-1/2 hidden lg:block h-full">
            <img
              src={loginImage}
              alt="Placeholder Image"
              className="object-fill w-full max-w-[882px] h-full"
            />
          </div>
          <div className="lg:px-36 md:px-52 px-16 w-full lg:w-1/2 h-full flex flex-col gap-[20px] py-0 justify-center">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-full max-w-[268px] h-[62px]" />
          </div>
            <div>
              {/* <h1 className="text-4xl text-blue-800 font-bold mb-3">BluField</h1> */}
              <p className="text-[17px] text-[#777777] text-center font-semibold">
              Utilities & Tasks <br /> Management Solutions
              </p>
              <div className="mt-8">
                {!forgotPasswordMode ? (
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={registrationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="flex flex-col gap-3">
                        <div className="">
                          <label
                            htmlFor="email"
                            className="block leading-6 text-sm font-semibold text-[#777777]"
                          >
                           {translations[langMode]?.UsernameEmailAddress}
                          </label>
                          <div className="mt-[10px]">
                            <Field
                              type="text"
                              name="email"
                              id="email"
                              className={`w-full border border-[#777777] rounded-[10px] py-3 px-3 focus:outline-none
                                focus:border-blue-500   ${theme === "dark"
                                  ? "text-black"
                                  : theme === "high-contrast"
                                    ? "text-black"
                                    : ""
                                }`}
                                style={{
                                  boxShadow: "0px 1.57px 3.13px 0px #0000000D"
                                }}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-rose-500"
                            />
                          </div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="password"
                            className="block leading-6 text-sm font-semibold text-[#777777]"
                          >
                            {translations[langMode]?.Password}
                          </label>
                          <div className="relative mt-[10px]">
                            <Field
                              name="password"
                              id="password"
                              type={showPassword ? "text" : "password"}
                              className={`w-full border border-[#777777] rounded-[10px] py-3 px-3 focus:outline-none focus:border-blue-500 
                                ${theme === "dark"
                                  ? "text-black"
                                  : theme === "high-contrast"
                                    ? "text-black"
                                    : ""
                                }`}
                                style={{
                                  boxShadow: "0px 1.57px 3.13px 0px #0000000D"
                                }}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute text-sm text-gray-400 top-[35%] right-3.5"
                            >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-rose-500"
                          />
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="remember"
                              name="remember"
                              className="text-blue-500"
                            />
                            <label
                              htmlFor="remember"
                              className="text-[#777777] ml-2 text-sm"
                            >
                               {translations[langMode]?.RememberMe}
                            </label>
                          </div>
                          <div className="text-[#777777] text-sm">
                            <Link
                              to=""
                              onClick={toggleForgotPasswordMode}
                              className="underline"
                            >
                               {translations[langMode]?.ForgotPassword}
                            </Link>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#236DB4] mt-[10px] text-white rounded-[10px] text-center justify-center py-3 px-4 w-full inline-flex items-center gap-2"
                          disabled={isSubmitting}
                        >
                          {translations[langMode]?.Login}
                          {loading && <RiLoader3Fill />}
                        </button>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    initialValues={{ email: "" }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email("Invalid email")
                        .required("Email is required"),
                    })}
                    onSubmit={handleForgotPassword}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-2">
                          <label
                            htmlFor="forgotEmail"
                            className="block text-sm leading-6 font-semibold text-[#777777]"
                          >
                            Enter your email address to reset password
                          </label>
                          <div className="mt-2.5">
                            <Field
                              type="email"
                              name="email"
                              id="forgotEmail"
                              className={`  ${theme === "dark"
                                ? "text-black"
                                : theme === "high-contrast"
                                  ? "text-black"
                                  : ""
                                } w-full border border-[#777777] rounded-[10px] py-3 px-3 shadow-sm focus:outline-none
                              focus:border-blue-50`}
                            />
                            <ErrorMessage name="email" component="div" />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#236DB4] mt-2.5 text-white rounded-[10px] text-center justify-center py-3 px-4  w-full inline-flex items-center gap-2"
                          disabled={isSubmitting}
                        >
                          Get OTP
                          {loading && <RiLoader3Fill />}
                        </button>
                        <div className="mt-6 justify-center text-gray-400">
                          <Link
                            to=""
                            onClick={toggleForgotPasswordMode}
                            className="underline"
                          >
                            Back
                          </Link>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}

                <div ref={navbarRef} className="flex justify-start mt-4">
                  <LangComp isShowIcon={false} languageDataList={languageData} toggleLangMode={toggleLangMode}
                    isNavbarOpen={isNavbarOpen} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {resetEmail && !resetPassword && (
        <>
          <OtpVerification emaill={resetEmail} />
          {/* <button onClick={() => setResetPassword(true)}>
            Proceed to Reset Password
          </button> */}
        </>
      )}
      {resetPassword && <ResetPasswordPage emaill={resetEmail} />}
    </>
  );
};

export default LoginPage;
