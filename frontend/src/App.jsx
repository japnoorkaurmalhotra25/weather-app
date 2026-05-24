import React, { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Stormy from "./components/Stormy";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("night");

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "night" ? "day" : "night"
    );
  };

  return (
    <BrowserRouter>
      <div className={`theme-${theme}`}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home
                  theme={theme}
                  toggleTheme={toggleTheme}
                />

                <Stormy />
              </>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;