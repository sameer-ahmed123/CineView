// src/components/Login.tsx
import "./login.css";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User logged in!");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button className="google_btn" onClick={handleGoogleLogin}>
        <i className="fa-brands fa-google google_icon"></i>
      </button>
      ;
    </>
  );
}

export default Login;
