import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignIn from "../../components/signin.component";
import SignUp from "../../components/signup.component";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [signup, setSignup] = useState(false);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setSignup(true);
    } else {
      setSignup(false);
    }
  }, [searchParams]);

  const handleSignup = () => {
    setSignup(!signup);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium text-gray-900 mb-3">Timely</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {signup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {signup
              ? "Sign up to start tracking your time"
              : "Sign in to your account"}
          </p>
        </div>

        {/* Form Container with Slide Animation */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${signup ? "-100%" : "0%"})` }}
          >
            {/* Sign In Section */}
            <div className="w-full flex-shrink-0">
              <SignIn />
            </div>

            {/* Sign Up Section */}
            <div className="w-full flex-shrink-0">
              <SignUp />
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            {signup
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={handleSignup}
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors underline"
          >
            {signup ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
