import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth?mode=signup");
  };

  const handleSignIn = () => {
    navigate("/auth?mode=signin");
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-white px-4 pt-24">
      <div className="text-center">
        <h1 className="text-5xl font-medium text-gray-900 mb-8">Timely</h1>
        <p className="text-xl text-gray-600 mb-6">
          Track your time, maximize your earnings
        </p>
        <p className="text-base text-gray-500 mb-16">
          Clock in, track hours, and calculate earnings in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGetStarted}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={handleSignIn}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
