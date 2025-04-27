import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { RxCross2 } from "react-icons/rx";
import Cookies from "js-cookie";
import lightmodeImg from "../../assets/Bluefield.png";
import darkmodeImg from "../../assets/logo.png";
const LoginModal = ({ open, setOpen }) => {
  const { theme, setRunTour } = useContext(AppContext);
  const cancelButtonRef = useRef(null);
  const userName = Cookies.get("userName");
  const firstlogin = Cookies.get("firstTimeLogin");

  const handleStart = () => {
    setOpen(false);
    setRunTour(true);
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
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
          <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity `}
          />
        </Transition.Child>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg 
                  ${
                    theme === "dark"
                      ? "dark-mode"
                      : theme === "high-contrast"
                      ? "high-contrast"
                      : ""
                  }`}
              >
                <div>
                  <div
                    class={`w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative ${
                      theme === "dark"
                        ? "dark-mode  "
                        : theme === "high-contrast"
                        ? "high-contrast  "
                        : ""
                    }`}
                  >
                    <div className="flex justify-end">
                      <RxCross2 onClick={() => setOpen(false)} />
                    </div>
                    <div class="my-4 text-center">
                      <div className="flex justify-center">
                        {theme === "dark" ? (
                          <div className="inline-flex gap-1">
                          <img
                           src={darkmodeImg}
                           alt="Logo"
                           className={`h-10 ${
                             theme === "dark" ? "dark-mode-img" : ""
                           }`}
                         />
                         <span className="text-3xl font-semibold">Blufield</span>
                        </div>
                        ) : (
                          <img src={lightmodeImg} alt="Logo" className="w-44" />
                        )}
                      </div>
                      <h4
                        class={`  ${
                          theme === "dark"
                            ? "dark-mode"
                            : theme === "high-contrast"
                            ? "high-contrast"
                            : ""
                        } text-xl text-gray-800 font-semibold mt-4`}
                      >
                        {firstlogin === "false" && "Welcome Back " }
                        {firstlogin === "true" && "Welcome "} 
                       {userName}!
                      </h4>
                      <h4
                        class={`  ${
                          theme === "dark"
                            ? "dark-mode"
                            : theme === "high-contrast"
                            ? "high-contrast"
                            : ""
                        } text-xl text-gray-800 font-semibold mt-4`}
                      ></h4>
                    </div>
                    {firstlogin === "true" && (
                      <div className="flex gap-14">
                        <button
                          type="button"
                          className={`mt-4 px-5 py-2.5 w-full rounded-lg text-white text-sm border-none outline-none bg-gray-800 hover:bg-gray-700 ${
                            theme === "dark"
                              ? "dark-mode border border-blue-300"
                              : theme === "high-contrast"
                              ? "high-contrast"
                              : ""
                          }`}
                          onClick={handleStart}
                        >
                          Start Guide Tour
                        </button>

                        <button
                          type="button"
                          className={` mt-4 px-5 py-2.5 w-full rounded-lg text-white text-sm border-none outline-none bg-gray-800 hover:bg-gray-700 ${
                            theme === "dark"
                              ? "dark-mode border border-blue-300"
                              : theme === "high-contrast"
                              ? "high-contrast"
                              : ""
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default LoginModal;
