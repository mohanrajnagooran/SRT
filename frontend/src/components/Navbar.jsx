import React from 'react'
import { Link, NavLink, } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../pages/loginPage/authSlice';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'


function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"> {/* Dark background, shadow, fixed to top */}
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/"> {/* Bold text, larger font size */}
          <img
            src={logo}
            alt="SRT Parcel Delivery Logo"
            width={120}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> {/* ms-auto pushes items to the RIGHT */}
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } aria-current="page" to="/"> 
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/customers">Customers</NavLink> 
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/places">Places</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/articles">Articles</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/lrs">LRs</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/usermanagement">User Management</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/expenses/misc">Misc Expenses</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/travel">Travel</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/driver">Driver</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/vehicle">Vehicle</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  isActive
                    ? "nav-link text-warning active-custom-link"
                    : "nav-link text-white"
                } to="/routeprefix">Route</NavLink>
            </li>
          </ul>
        </div>
          <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </nav>
  )
}

export default Navbar