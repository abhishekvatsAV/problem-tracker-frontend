import React from "react";

const useLogout = () => {
  const logout = () => {
    localStorage.removeItem("user");
  };
  return { logout };
};

export default useLogout;
