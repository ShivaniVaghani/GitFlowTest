import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import * as Yup from "yup";
import loginImage from "../../assets/loginImage.png";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../service/AuthService";
import { AppContext } from "../../context/AppContext";

const ResetPasswordPage = ({ emaill }) => {
  const location = useLocation();
  emaill = location.state?.emaill || emaill;
  const fromProfile = location.state?.fromProfile || false;
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {theme} = useContext(AppContext)
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await resetPassword(emaill, values.newPassword);
      if (data.header && data.header.code === 600) {
        if (fromProfile) {
          navigate("/"); 
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 flex justify-center items-center h-screen">
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-4xl text-blue-800 font-bold mb-20">BluField</h1>
          <h3 className="text-md text-gray-500 font-semibold">
            Reset Your Password
          </h3>
          <div className="mt-5">
            <Formik
              initialValues={{
                newPassword: "",
              }}
              validationSchema={Yup.object({
                newPassword: Yup.string()
                  .min(8, "Password must be at least 8 characters")
                  .required("Required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                  .required("Required"),
              })}
              onSubmit={handleSubmit}>
              <Form>
                <div className="mb-5">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold leading-6 text-gray-400 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Field
                      name="newPassword" 
                      id="newPassword" 
                      type={showNewPassword ? "text" : "password"}
                      className={`w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm 
                        focus:outline-none focus:border-blue-500  ${
                              theme === "dark"
                                ? "text-black"
                                : theme === "high-contrast"
                                ? "text-black"
                                : ""
                            }`}
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute text-sm text-gray-400 top-3.5 right-3.5"
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold leading-6 text-gray-400 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword" 
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`  ${
                              theme === "dark"
                                ? "text-black"
                                : theme === "high-contrast"
                                ? "text-black"
                                : ""
                            } w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm
                       focus:outline-none focus:border-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute text-sm text-gray-400 top-3.5 right-3.5"
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-600 text-white  rounded-md py-2 px-4 w-full"
                >
                  Continue
                </button>
              </Form>
            </Formik>
          </div>
        </div>
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src={loginImage}
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
