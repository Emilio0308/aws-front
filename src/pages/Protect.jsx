import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Protect = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.JWT) {
      navigate("/");
    }
  }, [user]);

  return <Outlet />;
};
export default Protect;
