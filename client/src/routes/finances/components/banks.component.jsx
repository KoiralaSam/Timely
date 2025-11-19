import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { FiCreditCard, FiShield, FiCheck, FiLoader } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const API_BASE_URL_V1 = `${API_BASE_URL}/api/v1`;

const Banks = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  const generateToken = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("Please log in to link bank accounts");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL_V1}/plaid/link-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });
      const data = await response.json();

      if (response.ok && data.link_token) {
        setLinkToken(data.link_token);
      } else {
        setError(data.message || "Failed to generate link token");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateToken();
  }, []);

  const LinkButton = ({ linkToken }) => {
    const [isLinking, setIsLinking] = useState(false);
    const [linkSuccess, setLinkSuccess] = useState(false);

    const onSuccess = React.useCallback(async (public_token, metadata) => {
      console.log("onSuccess callback triggered!");
      setIsLinking(true);
      console.log("Public token:", public_token);
      console.log("Metadata:", metadata);
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.post(
          `${API_BASE_URL_V1}/plaid/exchange-token`,
          {
            public_token,
            institution_id: metadata?.institution?.institution_id,
            institution_name: metadata?.institution?.name,
          },
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setLinkSuccess(true);
          // Refresh linked accounts list
          // TODO: Fetch linked accounts
        }
      } catch (error) {
        console.error("Error exchanging token:", error);
        setError(
          error.response?.data?.message || "Failed to link bank account"
        );
      } finally {
        setIsLinking(false);
      }
    }, []);

    const config = {
      token: linkToken,
      onSuccess,
      onExit: (err, metadata) => {
        console.log("Plaid Link exited:", err, metadata);
      },
      onEvent: (eventName, metadata) => {
        console.log("Plaid Link event:", eventName, metadata);
      },
    };

    const { open, ready } = usePlaidLink(config);

    console.log("Plaid Link ready:", ready, "linkToken:", linkToken);

    if (linkSuccess) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-green-100 rounded-full p-3">
              <FiCheck className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-1">
            Bank Account Linked Successfully!
          </h3>
          <p className="text-sm text-green-700">
            Your bank account has been connected and is ready to use.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <FiCreditCard className="text-blue-600" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Link Your Bank Account
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Securely connect your bank account to automatically track expenses
            and manage your finances in one place.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              <FiShield className="text-gray-600" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Bank-level Security
              </h3>
              <p className="text-sm text-gray-600">
                Your credentials are encrypted and never stored on our servers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              <FiCheck className="text-gray-600" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Automatic Expense Tracking
              </h3>
              <p className="text-sm text-gray-600">
                Transactions are automatically imported and categorized for you.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              <FiCheck className="text-gray-600" size={18} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Real-time Updates
              </h3>
              <p className="text-sm text-gray-600">
                Get instant updates on your spending and account balances.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            console.log("Link button clicked, opening Plaid Link...");
            open();
          }}
          disabled={!ready || isLinking}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLinking ? (
            <>
              <FiLoader className="animate-spin" size={20} />
              <span>Linking Account...</span>
            </>
          ) : (
            <>
              <FiCreditCard size={20} />
              <span>Link Bank Account</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By linking your account, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Banks</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-12">
          <div className="flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-gray-400 mb-4" size={32} />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !linkToken) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Banks</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Banks</h2>
      {linkToken ? (
        <LinkButton linkToken={linkToken} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-center">
            Unable to initialize bank linking. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Banks;
