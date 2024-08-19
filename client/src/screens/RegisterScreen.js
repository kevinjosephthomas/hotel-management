import React, { useState } from "react";
import axios from "axios";

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation functions
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@gmail\.com$/.test(email);
  const validatePassword = (password) => password.length >= 7;

  async function register() {
    if (!validateName(name)) {
      setError("Name should contain only letters.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email should be in the format: example@gmail.com.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password should be at least 7 characters long.");
      return;
    }

    if (password === cpassword) {
      const user = {
        name,
        email,
        password,
      };

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const result = (await axios.post("/api/users/register", user)).data;
        console.log(result);
        setSuccess("Registration successful");
        setName("");
        setEmail("");
        setPassword("");
        setCpassword("");
      } catch (error) {
        console.log(error);
        setError("Registration failed");
      }

      setLoading(false);
    } else {
      setError("Passwords do not match.");
    }
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <Error msg={error} />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success && <Success msg={success} />}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="confirm password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            {loading ? (
              <div>Registering... Please Wait...</div>
            ) : (
              <button className="btn btn-primary mt-3" onClick={register}>
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
