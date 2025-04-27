import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { FiGlobe } from "react-icons/fi";
import classNames from "classnames";

const LangComp = ({ toggleLangMode ,isNavbarOpen ,isShowIcon ="true" , languageDataList}) => {
  const { theme, langMode } = useContext(AppContext);
  const data = languageDataList ? languageDataList :[
    { id: 1, lang: "en", langText: "Eng" },
    { id: 2, lang: "ur", langText: "Ur" },
    { id: 3, lang: "ar", langText: "Ar" },
  ];

  const [selectedLang, setSelectedLang] = useState(langMode || "en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (lang) => {
    setSelectedLang(lang);
    toggleLangMode(lang);
    setIsOpen(false);
  };

  const getLangText = (lang) => {
    const selected = data.find((item) => item.lang === lang);
    return selected ? selected.langText : "Eng";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative flex items-center space-x-2 ${!isShowIcon ? "rounded-md" : ""}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select Language"
        className={classNames(
          "flex items-center py-1 transition-all rounded-md",
          theme === "dark" ? "bg-gray-800 text-white" : "bg-transparent text-black",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          isShowIcon ? "px-2 rounded-lg gap-1" : "px-5 gap-2 !bg-transparent border focus:border-gray-300 text-gray-700",
          !isShowIcon && isOpen && theme !== "dark" ? "!bg-gray-200" : "bg-transparent"
        )}
      >
       {isShowIcon ? <FiGlobe size={20} /> : null}
        <span className="text-sm">{getLangText(selectedLang)}</span>
        {!isShowIcon && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          style={{ zIndex: 99999, position: isShowIcon ?"fixed": "absolute", marginLeft: !isShowIcon ? "0": "" }}
          className={classNames(
            "cursor-pointer mt-2 rounded-lg shadow-lg p-1 text-sm  transition-all ",
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black",
            isNavbarOpen  ? "top-32"  :"top-10",
            !isShowIcon ? "top-6 w-28" : "top-10 w-20"
          )}
        >
          {data.map((item) => (
            <div
              key={item.id}
              role="menuitem"
              onClick={() => handleChange(item.lang)}
              className={classNames(
                "flex items-center gap-2 px-2 py-1 cursor-pointer rounded-md",
                "hover:bg-gray-200 dark:hover:bg-gray-700",
                selectedLang === item.lang && "bg-gray-300 dark:bg-gray-600 ",
                !isShowIcon ? "text-gray-800" : ""
              )}
            >
              {item.langText}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LangComp;
