import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../pages/loginPage/authSlice";
import logo from "../assets/logo.png";

export default function Sidebar({ open, toggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${
      isActive ? "bg-gray-700 text-yellow-400" : "text-white"
    }`;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-dark text-white transform ${open ?"translate-x-0" : "-translate-x-full"}transition-transform duration-300 md:translate-x-0`}
    >
      <div className="p-4 border-b border-gray-700">
        <img src={logo} width="110" alt="logo" />
      </div>

      <nav className="flex flex-col gap-8 p-10">
        <li>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={linkClass}>
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/places" className={linkClass}>
            Places
          </NavLink>
        </li>
        <li>
          <NavLink to="/articles" className={linkClass}>
            Articles
          </NavLink>
        </li>
        <li>
          <NavLink to="/lrs" className={linkClass}>
            LRs
          </NavLink>
        </li>
        <li>
          <NavLink to="/usermanagement" className={linkClass}>
            User Management
          </NavLink>
        </li>
        <li>
          <NavLink to="/expenses/misc" className={linkClass}>
            Misc Expenses
          </NavLink>
        </li>
        <li>
          <NavLink to="/travel" className={linkClass}>
            Travel
          </NavLink>
        </li>
        <li>
          <NavLink to="/driver" className={linkClass}>
            Driver
          </NavLink>
        </li>
        <li>
          <NavLink to="/vehicle" className={linkClass}>
            Vehicle
          </NavLink>
        </li>
        <li>
          <NavLink to="/routeprefix" className={linkClass}>
            Route
          </NavLink>
        </li>
      </nav>

      <div className="p-3 mt-auto">
        <button onClick={handleLogout} className="btn btn-outline-light w-100">
          Logout
        </button>
      </div>
    </div>
  );
}
