import { useState } from "react";
import { BASE_URL } from "../services/helper";
import axios from "axios";

const useSignup = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = BASE_URL;

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    let response = await axios.post(
      `${apiUrl}/user/signup`,
      { email, password },
      { validateStatus: () => true }
    );

    if (response.status !== 200) {
      setIsLoading(false);
      setError(response.data.error);
    }
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error, setError };
};

export default useSignup;
