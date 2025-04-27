import react, { useState } from "react";
import Header from "./Header";
import logo from "../../assets/logo.png"
import { useNavigate } from "react-router-dom";

const HeaderNavBar = () => {
  const navigate = useNavigate()
  const [showNames, setShowNames] = useState(false);
  return (
    <>
      <aside className={`${showNames ? "w-[200px]" : 'w-[78px] py-4 my-[10px]'} transition-all duration-300 ease-in-out bg-[#EBF5FF] shadow-lg flex flex-col items-center rounded-[20px] overflow-x-hidden custom-side-scrollbar`}
      >
        {/* {!showNames && <div className="mb-3" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="Logo" className="w-10 h-10 cursor-pointer" />
        </div>} */}
        <div className="flex flex-col space-y-6">
          <Header setShowNames={setShowNames} showNames={showNames} />
        </div>
      </aside>
    </>
  )

}

export default HeaderNavBar;