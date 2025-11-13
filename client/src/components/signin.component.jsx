import React from "react";
import { Fragment } from "react";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

import axios from "axios";

const SignIn = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { dispatchUser } = useContext(UserContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log(data);
    axios({
      url: "http://localhost:8080/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((res) => {
        // res.data has structure: { message, token, user: { id, email, name, ... } }
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] mt-8"
          >
            Sign In
          </button>
        </div>
      </form>
    </Fragment>
  );
};
export default SignIn;
