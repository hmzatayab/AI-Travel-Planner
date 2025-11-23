import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export const UserRedirectWrapper = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return <>{children}</>;
};
