import React, { useContext, useState, useEffect, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Cookies from "js-cookie";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as Yup from "yup";

import OtpVerification from "./OtpVerification";
import ResetPasswordPage from "./ResetPasswordPage";

// Named import for the context object
import { AppContext } from "../../context/AppContext";

import { generateToken } from "../../Push_notification/Notification";
import { loginUser, storeFcmToken, forgotPassword } from "../../service/AuthService";
import { RiLoader3Fill } from "react-icons/ri";

import logo from "./../../assets/Bluefield.png";
import loginImage from "./../../assets/loginImage.png";
import LangComp from "../../components/_app/LangComp";
import translations from "../../components/common/Translations";

const registrationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const languageData = [
  { id: 1, lang: "en", langText: "English" },
  { id: 2, lang: "ur", langText: "Urdu" },
  { id: 3, lang: "ar", langText: "Arabic" },
];

const LoginPage = () => {
  const { setUser, theme, fetchNotifications, toggleLangMode, langMode } = useContext(AppContext);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navbarRef = useRef(null);

  const togglePasswordVisibility = () => setShowPassword(v => !v);
  const toggleForgotPasswordMode = () => setForgotPasswordMode(v => !v);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const responseData = await loginUser(values);

      if (responseData.header.code === 600) {
        const { userDetails, accessToken } = responseData.body.value;

        // Persist user
        setUser(userDetails);
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        localStorage.setItem("justLoggedIn", "true");
        localStorage.setItem("accessToken", accessToken);

        // Set cookies
        const expires = new Date(Date.now() + 7 * 60 * 60 * 1000);
        Cookies.set("accessToken", accessToken, { expires });
        Cookies.set("userType", userDetails.userType, { secure: true, sameSite: "strict" });
        Cookies.set("userId", userDetails.userId);
        Cookies.set("userName", userDetails.name);
        Cookies.set("userVisibility", userDetails.userVisibility);
        Cookies.set("userEmail", userDetails.email, { httpOnly: true });
        Cookies.set("profilePic", userDetails.profilePic);
        Cookies.set("firstTimeLogin", userDetails.firstTimeLogin);

        toast.success(
          `${userDetails.firstTimeLogin === "false" ? "Welcome back" : "Welcome"} ${userDetails.name}`
        );

        // Push notifications (stubbed for login flow)
        const token = await generateToken();
        await storeFcmToken(token, accessToken);
        fetchNotifications(0);

        // Redirect to Script Runner UI
        window.location.href = "/runner/index.html";
        return;
      }

      // Other response codes
      if (responseData.header.code === 612) {
        toast.error("Email or password is wrong");
      } else if (responseData.header.code === 613) {
        setResetEmail(values.email);
        setResetPassword(true);
      } else if (responseData.header.code === 608) {
        toast.error("Access Denied");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const onClickOutside = e => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsNavbarOpen(false);
      }
    };
    document[isNavbarOpen ? "addEventListener" : "removeEventListener"]("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isNavbarOpen]);

  return (
    <>
      {!resetEmail && !resetPassword && (
        <div
          className="flex justify-center items-center h-screen"
          style={{ background: "radial-gradient(#1E429F33, #FFFFFF)" }}
        >
          <div className="w-1/2 hidden lg:block h-full">
            <img src={loginImage} alt="Login illustration" className="object-fill w-full h-full" />
          </div>
          <div className="px-16 lg:px-36 md:px-52 w-full lg:w-1/2 h-full flex flex-col gap-5 justify-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Logo" className="w-full max-w-[268px] h-[62px]" />
            </div>
            <p className="text-center text-gray-500 font-semibold mb-8">
              Utilities & Tasks<br />Management Solutions
            </p>

            {!forgotPasswordMode ? (
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={registrationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        {translations[langMode]?.UsernameEmailAddress}
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="text"
                        className="mt-2 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring"
                        placeholder="Email"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        {translations[langMode]?.Password}
                      </label>
                      <div className="relative mt-2">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-2 text-gray-400"
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center">
                        <Field type="checkbox" name="remember" className="form-checkbox" />
                        <span className="ml-2 text-sm">{translations[langMode]?.RememberMe}</span>
                      </label>
                      <button
                        type="button"
                        onClick={toggleForgotPasswordMode}
                        className="text-sm text-blue-600 underline"
                      >
                        {translations[langMode]?.ForgotPassword}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-blue-600 text-white py-2 rounded-md disabled:opacity-50 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {translations[langMode]?.Login}
                      {loading && <RiLoader3Fill className="ml-2 animate-spin" />}
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ email: "" }}
                validationSchema={Yup.object({
                  email: Yup.string().email("Invalid email").required("Required"),
                })}
                onSubmit={handleForgotPassword}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700">
                        Enter your email to reset password
                      </label>
                      <Field
                        id="forgotEmail"
                        name="email"
                        type="email"
                        className="mt-2 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring"
                        placeholder="Email"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Get OTP
                    </button>
                    <button
                      type="button"
                      onClick={toggleForgotPasswordMode}
                      className="mt-2 text-sm text-blue-600 underline"
                    >
                      Back to login
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            <div ref={navbarRef} className="mt-4">
              <LangComp
                isShowIcon={false}
                languageDataList={languageData}
                toggleLangMode={toggleLangMode}
                isNavbarOpen={isNavbarOpen}
              />
            </div>
          </div>
        </div>
      )}

      {resetEmail && !resetPassword && <OtpVerification emaill={resetEmail} />}

      {resetPassword && <ResetPasswordPage emaill={resetEmail} />}
    </>
  );
};

export default LoginPage;
