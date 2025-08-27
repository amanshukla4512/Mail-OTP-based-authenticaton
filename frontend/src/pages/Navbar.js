import React from "react";
import { FiLogOut } from "react-icons/fi"; // React Icon for logout
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const name = useSelector((state) => state.people.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const OnPressLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <header className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-semibold">Welcome {name}</div>
        <button
          onClick={OnPressLogout}
          className="text-white hover:text-gray-300 flex items-center"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
