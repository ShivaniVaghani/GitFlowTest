import React, { useContext } from "react";
import { useRef, useState } from "react";
import otpImage from "./../../assets/loginImage.png"
import ResetPasswordPage from "./ResetPasswordPage";
import { toast } from "react-toastify";
import { checkOtp } from "../../service/AuthService";
import { AppContext } from "../../context/AppContext";

const OtpVerification = ({ emaill }) => {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const inputOne = useRef(null);
  const inputTwo = useRef(null);
  const inputThree = useRef(null);
  const inputFour = useRef(null);
  const { theme } = useContext(AppContext);
  const inputChangeHandler = (event, nextInput) => {
    if (event.target.value.length === 1 && nextInput) {
      nextInput.current.focus();
    }
  };

  async function onSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      const otp_1 = inputOne.current.value;
      const otp_2 = inputTwo.current.value;
      const otp_3 = inputThree.current.value;
      const otp_4 = inputFour.current.value;
      const otp = `${otp_1}${otp_2}${otp_3}${otp_4}`;
      const responseData = await checkOtp(otp, emaill);
      if (responseData.header.code === 600) {
        toast.success("OTP correct");
        setLoading(false);
        setResetEmail(emaill);
      } else {
        toast.error(responseData.body.value);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!resetEmail && (
        <div className="flex justify-center items-center h-screen" 
        style={{
          padding : "40px 32px",
          background: "radial-gradient(#1E429F33, #FFFFFF)"
        }}>
          <div className="w-1/2 hidden lg:block h-full">
            <img
              src={otpImage}
              alt="Placeholder Image"
              className="object-fill w-full max-w-[882px] h-full rounded-[31px]"
            />
          </div>
          <div className="lg:px-36 md:px-52 sm:p-20 p-8 w-full lg:w-1/2 text-center">
            <h1 className="text-sm text-blue-800 mb-4">
              We have sent you{" "}
              <span className="font-bold">One Time Password</span> to your email
            </h1>
            <p className="text-sm text-gray-500 font-semibold">
              Please Enter OTP
            </p>
            <div className="mt-10">
              <form onSubmit={onSubmit}>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    <div className="w-16 h-16">
                      <input
                        className={`w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none border-b-2
                         border-gray-400 text-md bg-white  ${
                           theme === "dark"
                             ? "text-black"
                             : theme === "high-contrast"
                             ? "text-black"
                             : ""
                         }`}
                        type="text"
                        name="inputOne"
                        id="inputOne"
                        maxLength={1}
                        ref={inputOne}
                        onChange={(e) => inputChangeHandler(e, inputTwo)}
                      />
                    </div>
                    <div className="w-16 h-16">
                      <input
                        className={`w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none border-b-2
                         border-gray-400 text-md bg-white  ${
                           theme === "dark"
                             ? "text-black"
                             : theme === "high-contrast"
                             ? "text-black"
                             : ""
                         }`}
                        type="text"
                        name="inputTwo"
                        id="inputTwo"
                        maxLength={1}
                        ref={inputTwo}
                        onChange={(e) => inputChangeHandler(e, inputThree)}
                      />
                    </div>
                    <div className="w-16 h-16">
                      <input
                        className={`w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none border-b-2
                         border-gray-400 text-md bg-white  ${
                           theme === "dark"
                             ? "text-black"
                             : theme === "high-contrast"
                             ? "text-black"
                             : ""
                         }`}
                        type="text"
                        name="inputThree"
                        id="inputThree"
                        maxLength={1}
                        ref={inputThree}
                        onChange={(e) => inputChangeHandler(e, inputFour)}
                      />
                    </div>
                    <div className="w-16 h-16">
                      <input
                        className={`w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none
                         border-b-2 border-gray-400 text-md bg-white  ${
                           theme === "dark"
                             ? "text-black"
                             : theme === "high-contrast"
                             ? "text-black"
                             : ""
                         }`}
                        type="text"
                        name="inputFour"
                        id="inputFour"
                        maxLength={1}
                        ref={inputFour}
                        onChange={(e) => inputChangeHandler(e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center gap-6">
                    <button
                      className="rounded-[10px] py-3 px-6 font-sans text-xs  uppercase text-[#236DB4] border border-[#236DB4]  transition-all  focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      data-ripple-light="true"
                    >
                      Resend OTP
                    </button>
                    <button
                      className="rounded-[10px] bg-[#236DB4] py-3 px-6 font-sans text-xs  uppercase text-white  transition-all hover:shadow-lg  focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      data-ripple-light="true"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {resetEmail && <ResetPasswordPage emaill={resetEmail} />}
    </div>
  );
};

export default OtpVerification;
