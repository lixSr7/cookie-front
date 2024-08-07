import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

const useAuth = () => {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);

      setId(decodedToken.id);
    }
  }, []);

  return id;
};

export default useAuth;
