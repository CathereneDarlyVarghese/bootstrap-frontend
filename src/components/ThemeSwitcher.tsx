import React, { useState, useEffect } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonFill } from "react-icons/bs";

const ThemeSwitcher = () => {
  const getDefaultTheme = () => {
    const preferThemeMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return preferThemeMode;
  };

  const [isDarkMode, setIsDarkMode] = useState(getDefaultTheme());

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (event) => {
      setIsDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    if (document.documentElement) {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  return (
    <div>
      <button
        className="btn btn-sm bg-transparent hover:bg-transparent text-black"
        onClick={toggleTheme}
      >
        {isDarkMode ? (
          <BsFillSunFill className="text-white" />
        ) : (
          <BsFillMoonFill className="text-white" />
        )}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
