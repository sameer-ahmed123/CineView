import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import './logout.css'
export function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("user logged out");
        navigate("/");
      })
      .catch((error) => {
        console.error("signout error  " + error);
      });
  };
  return (
    <>
      <button className="Logout_btn" onClick={handleLogout}>Logout</button>
    </>
  );
}
