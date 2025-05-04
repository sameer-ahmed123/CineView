import { FormEvent, useState } from "react";
import { signup } from "../authcontroler";
import { useNavigate } from "react-router-dom";
import "./Signuppage.css";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signup(email, password);
    navigate("/");
  };

  return (
    <>
      <div className="Auth_Container">
        <form className="Signup_form" action="" onSubmit={handleSubmit}>
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
            <button className="signupbtn" type="submit">
              Signup
            </button>
          </div>
          <div className="other-options">
            {" "}
            <p>Already have an account?</p>
            <a href="/auth">login</a>
          </div>
        </form>
      </div>
    </>
  );
}
export default Signup;
