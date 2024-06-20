import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInp from "./../../components/PasswordInp/PasswordInp";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState(null);
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name) {
      seterror("enter your name");
      return;
    }
    if (!validateEmail(email)) {
      seterror("entert a valid email");
      return;
    }
    if (!password) {
      seterror("entert a valid password");
      return;
    }
    seterror("");
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Signup</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInp
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
