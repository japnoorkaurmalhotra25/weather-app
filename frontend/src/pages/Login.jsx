import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem(
        "weathercastUser",
        JSON.stringify(res.data)
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-auth">
      {/* LEFT SECTION */}
      <div className="premium-left">
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>

        <div className="premium-content">
          <div className="logo-box">
            🌦 WeatherCast
          </div>

          <h1>
            Forecasts That Feel
            <span> Intelligent.</span>
          </h1>

          <p>
            Get AI-powered weather
            insights, rain alerts, UV
            tracking, and personalized
            forecasts from Stormy.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              🌧 Real-time Rain Alerts
            </div>

            <div className="feature-card">
              ☀️ UV & AQI Tracking
            </div>

            <div className="feature-card">
              🤖 Stormy AI Assistant
            </div>

            <div className="feature-card">
              📍 Multiple Locations
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="premium-right">
        <div className="form-card">
          <div className="step-indicator">
            Welcome Back 👋
          </div>

          <h2>Login</h2>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div
              className="input-box"
              style={{
                position: "relative",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#7fabe8",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>

            {/* REMEMBER/FORGOT */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "24px",
                color: "#94a3b8",
                fontSize: "0.95rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <input type="checkbox" />
                Remember me
              </label>

              <span
                style={{
                  color: "#38bdf8",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </span>
            </div>

            {/* BUTTON */}
            <button className="premium-btn">
              {loading
                ? "Logging in..."
                : "Enter WeatherCast"}
            </button>
          </form>

         
          {/* SWITCH */}
          <div className="switch-auth">
            Don’t have an account?{" "}
            <Link to="/signup">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}