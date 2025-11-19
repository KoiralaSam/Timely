import React, { Fragment, useContext, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const SignUp = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { dispatchUser } = useContext(UserContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      hourly_rate: parseFloat(event.target.hourly_rate.value),
    };
    axios({
      url: `${API_BASE_URL}/signup`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((res) => {
        // res.data has structure: { message, token, user: { id, email, name, hourly_rate } }
        dispatchUser({
          type: "SET_USER",
          payload: {
            token: res.data.token,
            user: res.data.user,
          },
        });
        // Use setTimeout to ensure context updates before navigation
        setTimeout(() => {
          navigate("/home");
        }, 100);
      })
      .catch((error) => {
        console.log(error.response?.data || error.message);
      });
  };

  const handleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Fragment>
      <form
        className="w-full max-w-md p-8 bg-white text-gray-800"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                id="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={handleVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {!visible ? (
                  <FaEye size={18} />
                ) : (
                  <FaRegEyeSlash size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Hourly Rate Field */}
          <div>
            <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="hourly_rate"
              id="hourly_rate"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="20.00"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] mt-8"
          >
            Sign Up
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default SignUp;
