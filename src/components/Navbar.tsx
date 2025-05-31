import "./Navbar.css";
import Search from "./Search";
import { useAuth } from "../hooks/useAuth";
import { Logout } from "./Logout";


function NavBar() {
  const { user } = useAuth();
  const default_img ="/default.jpg"
  return (
    <nav className="navBar">
      <a className="navBrand" href="/">
        CineView
      </a>
      <ul className="navList">
        <li><Search /></li>
        <li>
          {user ? (
            <a href="/profile">
              <img className="profile_icon"
                src={user.photoURL || default_img}
                alt="pfp"
                width={40}
                height={40}
              />
            </a>
          ) : (
            <a href="/auth">
              <i className="fa-solid fa-user profile_icon"></i>
            </a>
          )}
        </li>
        <li>{user && <Logout />}</li>
      </ul>
    </nav>
  );
}

export default NavBar;
