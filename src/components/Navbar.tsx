import "./Navbar.css";
import Search from "./Search";
import { useAuth } from "../hooks/useAuth";

function NavBar() {
  const { user } = useAuth();
  const default_img =
    "https://www.pngall.com/wp-content/uploads/5/Avatar-Profile-PNG-Clipart.png";
  return (
    <>
      <nav className="navBar">
        <a className="navBrand" href="/">
          CineView
        </a>
        <ul className="navList">
          <li>
            <Search />
          </li>
          <li>
            {" "}
            {user ? (
              <>
                {" "}
                <a href="/auth">
                  <img
                    style={{ width: 40, height: 40, borderRadius: 50 }}
                    src={user.photoURL || default_img}
                    alt=""
                  />
                </a>
              </>
            ) : (
              <>
                <a href="/auth">
                  <i className="fa-solid fa-user profile_icon"></i>
                </a>
              </>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
