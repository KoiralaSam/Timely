import { useNavigate } from "react-router-dom";
import LoginPage from "./login-page";
import { HiOutlineArrowLeft } from "react-icons/hi";

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
      >
        <HiOutlineArrowLeft size={20} />
        Back
      </button>

      {/* Login/Signup Form */}
      <LoginPage />
    </div>
  );
};

export default AuthPage;
