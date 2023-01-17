import { useState } from "react";
import axios from "axios";

const useSignup = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

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
      console.log(" succsess ....");
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};

export default useSignup;
