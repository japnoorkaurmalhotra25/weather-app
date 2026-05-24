import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Country,
  State,
} from "country-state-city";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    state: "",
    preferredUnit: "C",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  /* =========================
     HANDLERS
  ========================= */

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (e) => {
    setForm({
      ...form,
      country: e.target.value,
      state: "",
    });
  };

  const handleStateChange = (e) => {
    setForm({
      ...form,
      state: e.target.value,
    });
  };

  /* =========================
     STEP VALIDATION
  ========================= */

  const nextStep = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {
      setError("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );

      return;
    }

    setError("");
    setStep(2);
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.city ||
      !form.country ||
      !form.state
    ) {
      setError(
        "Please complete location details"
      );

      return;
    }

    try {
      setLoading(true);

      const selectedCountry =
        Country.getCountryByCode(
          form.country
        );

      const payload = {
        ...form,

        country:
          selectedCountry?.name ||
          form.country,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      localStorage.setItem(
        "weathercastUser",
        JSON.stringify(res.data)
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STATES LIST
  ========================= */

  const states =
    State.getStatesOfCountry(
      form.country
    );

  return (
    <div className="premium-auth">
      {/* LEFT SIDE */}
      <div className="premium-left">
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>

        <div className="premium-content">
          <div className="logo-box">
            ⛅ WeatherCast
          </div>

          <h1>
            Experience Weather
            <span>
              {" "}
              Like Never Before
            </span>
          </h1>

          <p>
            AI-powered forecasts,
            personalized weather alerts,
            beautiful insights, and
            Stormy assistant — all in one
            place.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              🌧 Smart Rain Alerts
            </div>

            <div className="feature-card">
              ☀️ UV & AQI Monitoring
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

      {/* RIGHT SIDE */}
      <div className="premium-right">
        <div className="form-card">
          <div className="step-indicator">
            Step {step} of 2
          </div>

          <h2>Create Account</h2>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "28px",
            }}
          >
            Join WeatherCast and
            personalize your forecast
            experience.
          </p>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={nextStep}>
              <div className="input-box">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={
                    handleInputChange
                  }
                  required
                />
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={
                    handleInputChange
                  }
                  required
                />
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={
                    handleInputChange
                  }
                  required
                />
              </div>

              <button className="premium-btn">
                Continue →
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              {/* CITY */}
              <div className="input-box">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={
                    handleInputChange
                  }
                  required
                />
              </div>

              {/* COUNTRY */}
              <div className="input-box">
                <select
                  value={form.country}
                  onChange={
                    handleCountryChange
                  }
                  required
                >
                  <option value="">
                    Select Country
                  </option>

                  {Country.getAllCountries().map(
                    (country) => (
                      <option
                        key={
                          country.isoCode
                        }
                        value={
                          country.isoCode
                        }
                      >
                        {country.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* STATE */}
              <div className="input-box">
                <select
                  value={form.state}
                  onChange={
                    handleStateChange
                  }
                  required
                  disabled={
                    !form.country
                  }
                >
                  <option value="">
                    Select State
                  </option>

                  {states.map(
                    (state) => (
                      <option
                        key={
                          state.isoCode
                        }
                        value={
                          state.name
                        }
                      >
                        {state.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* TEMPERATURE */}
              <div className="input-box">
                <select
                  name="preferredUnit"
                  value={
                    form.preferredUnit
                  }
                  onChange={
                    handleInputChange
                  }
                >
                  <option value="C">
                    Celsius °C
                  </option>

                  <option value="F">
                    Fahrenheit °F
                  </option>
                </select>
              </div>

              <button
                className="premium-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Join WeatherCast"}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() =>
                  setStep(1)
                }
              >
                ← Back
              </button>
            </form>
          )}

          <div className="switch-auth">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}