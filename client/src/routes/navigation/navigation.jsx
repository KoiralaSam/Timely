import { Link, Outlet } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { HiOutlineClock } from "react-icons/hi";
import { HiOutlineWallet } from "react-icons/hi2";
import { HiOutlineFlag } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { dispatchUser } = useContext(UserContext);
  const handleLogout = () => {
    dispatchUser({ type: "LOGOUT_USER" });
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-8 py-3">
          {/* Logo */}
          <div className="text-lg font-medium text-gray-900">
            Timely
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1">
            <NavItem to="/home" icon={<HiOutlineClock size={18} />} label="Clock" />
            <NavItem
              to="/finances"
              icon={<HiOutlineWallet size={18} />}
              label="Finances"
            />
            <NavItem to="/goals" icon={<HiOutlineFlag size={18} />} label="Goals" />
            <NavItem
              to="/profile"
              icon={<HiOutlineUser size={18} />}
              label="Profile"
            />
            <NavItem
              to="/settings"
              icon={<HiOutlineCog6Tooth size={18} />}
              label="Settings"
            />
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RiLogoutBoxLine size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

const NavItem = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
