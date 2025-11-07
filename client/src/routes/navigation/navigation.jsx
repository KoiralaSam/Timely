import { Link, Outlet } from "react-router-dom";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { BsPersonSquare } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { FaClock } from "react-icons/fa";
import { FaHourglassHalf } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { dispatchUser } = useContext(UserContext);
  const handleLogout = () => {
    navigate("/");
    dispatchUser({ type: "logoutUser" });
  };

  return (
    <div className="flex flex-row">
      <div className="w-[300px] h-screen flex flex-col justify-between items-center  bg-gradient-to-t from-purple-300 to-purple-150 text-black shadow-xl p-5 text-[15px] ">
        <div className="text-xl font-bold font-Inter mt-5 tracking-widest">
          <em>
            <strong>Timely</strong>
          </em>
        </div>

        <nav className="flex flex-col w-full gap-4 mt-10">
          <NavItem to="/clock" icon={<FaClock size={25} />} label="Clock" />
          <NavItem
            to="/hours"
            icon={<FaHourglassHalf size={25} />}
            label="Hours"
          />
          <NavItem to="/salary" icon={<FaDollarSign />} label="Salary" />

          <NavItem
            to="/profile"
            icon={<BsPersonSquare size={25} />}
            label="Profile"
          />
          <NavItem
            to="/settings"
            icon={<CiSettings size={25} />}
            label="Settings"
          />
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full py-3 mt-20 text-sm font-semibold rounded-lg hover:bg-[#B8F2E6] hover:text-[#330036] transition duration-300"
        >
          <RiLogoutBoxRFill size={28} />
          Log Out
        </button>
      </div>
      <Outlet />
    </div>
  );
}

const NavItem = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-3 text-lg font-medium rounded-lg active:bg-[#B8F2E6] active:text-[#330036] focus:bg-[#B8F2E6] focus:text-[#330036] transition duration-300"
    >
      {icon}
      {label}
    </Link>
  );
};
