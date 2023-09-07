import { NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const onLogout = () => {
    localStorage.removeItem(storageKey);

    setTimeout(() => {
      location.replace(pathname);
    }, 1500);
  };

  return (
    <nav className="max-w-2xl mx-auto mt-7 mb-20 px-3 py-5">
      <ul className="flex items-center justify-between">
        <li className="duration-200 font-semibold text-md text-gray-700">
          <NavLink to="/">Home</NavLink>
        </li>

        {userData ? (
          <div className="flex items-center space-x-6">
            <li className="duration-200 text-md text-gray-700 font-semibold">
              <NavLink to="/todos">Todos</NavLink>
            </li>
            <li className="duration-200 text-md text-gray-700 font-semibold">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <Button className="cursor-pointer" size={"sm"} onClick={onLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className=" duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-white duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
