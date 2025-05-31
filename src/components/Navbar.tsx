import "./Navbar.css";
import Search from "./Search";
import { useAuth } from "../hooks/useAuth";
import { Logout } from "./Logout";

function NavBar() {
  const { user } = useAuth();
  const default_img =
    "https://static.vecteezy.com/system/resources/previews/053/547/120/large_2x/generic-user-profile-avatar-for-online-platforms-and-social-media-vector.jpg";

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
              <img
                src={user.photoURL || default_img}
                alt="Profile"
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
