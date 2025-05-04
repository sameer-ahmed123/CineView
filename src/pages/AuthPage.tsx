import { FormEvent, useState } from "react";
import Login from "../components/login";
import { Logout } from "../components/Logout";
import { useAuth } from "../hooks/useAuth";
import { login } from "../authcontroler";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate("/");
  };

  return (
    <>
      {user ? (
        <>
          <div className="logout_container">
            <div className="logout_form">
              <p>
                user's email: <b>{user.email}</b>
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
                className="form-group"
              >
                <p>user is logged IN</p>

                <Logout />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="Auth_Container">
            <form className="Login_form" action="" onSubmit={handleSubmit}>
              <h1>CineView</h1>
              <div className="form-group">
                <input
                  placeholder="Example@email.com"
                  type="email"
                  name="email"
                  id="email"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="********"
                  type="password"
                  name="password"
                  id="password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <button className="Loginbtn" type="submit">
                  Login
                </button>
              </div>
              <div className="other-options">
                {" "}
                <p>Dont have an account?</p>
                <a href="/signup">Signup</a>
              </div>
              <p>Signin with google</p> <Login />
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default AuthPage;
