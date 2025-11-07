import { useState } from "react";
import SignIn from "../../components/signin.component";
import SignUp from "../../components/signup.component";
const LoginPage = () => {
  const [signup, setSignup] = useState(false);
  const handleSignup = () => {
    setSignup(!signup);
    console.log(!signup); // show new state
  };
  return (
    <div className="relative flex items-center justify-center h-auto min-h-[60vh] text-black">
      <div
        className="w-full max-w-md flex transition-transform duration-500 ease-in-out transform"
        style={{ transform: `translateX(${signup ? "-100%" : "0%"})` }}
      >
        <div
          className={`w-full flex-shrink-0 transition-opacity duration-500 ${
            signup ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="m-4">
            <h2>Already have an Account?</h2>
            <span>Log in with your email and Password</span>
          </div>
          <SignIn />
          <button
            type="button"
            className="text-sm float-right mr-4 text-gray-600"
            onClick={handleSignup}
          >
            Don't have an Account?
          </button>
        </div>

        {/* SignUp Component */}
        <div
          className={`w-full flex-shrink-0 transition-opacity duration-500 ${
            signup ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="m-4">
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and Password</span>
          </div>
          <SignUp />
          <button
            type="button"
            className="text-sm float-right mr-4 text-gray-600"
            onClick={handleSignup}
          >
            Already have an Account?
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
