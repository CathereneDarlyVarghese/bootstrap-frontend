import React, { useEffect, useState } from "react";
import DubeButton from "./widgets/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import SignInWithGoogle from "./GoogleSignIn/SignInWithGoogle";
import { useAtom } from "jotai";
import { locationAtom, useSyncedAtom } from "store/locationStore";

import B from "../icons/B.svg";
import ootstrap from "../icons/ootstrap.svg";
import ScanButton from "./widgets/ScanButton";

const NavBar = () => {
  const [location, setLocation] = useSyncedAtom(locationAtom);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const routePage = useLocation();

  const toggleDropDown = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (routePage.pathname === "/home") {
      document.querySelector(".asset-tab").classList.add("border-b-white");
      document
        .querySelector(".workorder-tab")
        .classList.remove("border-b-white");
    } else if (routePage.pathname === "/work-orders") {
      document.querySelector(".asset-tab").classList.remove("border-b-white");
      document.querySelector(".workorder-tab").classList.add("border-b-white");
    }
  }, [routePage]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        console.log(userData);
        setUser(userData);
        window.localStorage.setItem(
          "sessionToken",
          userData.signInUserSession.accessToken.jwtToken
        );
        setIsLoading(false);
      } catch {
        console.log("Not signed in");
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="navbar bg-blue-900">
      <div className="flex-1">
        <a
          onClick={() => {
            navigate("/home");
          }}
          className="btn btn-ghost normal-case text-xl text-slate-100"
        >
          <img src={B} />
          <img src={ootstrap} />

          {/* <h1>ootstrap</h1> */}
          {/* Bootstrap */}
        </a>
        <div className="tabs">
          <a
            className="tab text-white border border-transparent border-b-white asset-tab"
            onClick={() => {
              navigate("/home");
            }}
          >
            Assets
          </a>
          <a
            className="tab text-white border border-transparent workorder-tab"
            onClick={() => {
              navigate("/work-orders");
            }}
          >
            Work Orders
          </a>
        </div>
      </div>

      <div className="flex-none gap-5 pr-5">
        {/* Location Button */}

        <ScanButton
          onClick={() => {
            navigate("/scan");
          }}
        />
        {/* <DubeButton
          title="Scan"
          onClick={() => {
            navigate("/scan");
          }}
          primary={false}
        /> */}
        <div className="dropdown dropdown-bottom">
          <label
            className="btn-sm px-5 btn w-fill btn-primary rounded-lg font-semibold focus:outline-none bg-blue-800 border-none hover:bg-gradient-to-r from-blue-800 to-blue-400"
            tabIndex={0}
            onClick={toggleDropDown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 m-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            {location.locationName}
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </label>
          {open && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li
                className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                onClick={() => {
                  setLocation({
                    locationName: "The Spiffy Dapper",
                    locationId: "tsd",
                  });
                  setOpen(!open);
                }}
              >
                The Spiffy Dapper
              </li>
              <li
                className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                onClick={() => {
                  setLocation({
                    locationName: "MadDog Bistro & Bar",
                    locationId: "mdb",
                  });
                  setOpen(!open);
                }}
              >
                MadDog Bistro & Bar
              </li>
            </ul>
          )}
        </div>

        {/* Location Button    */}

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a
                  className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                  onClick={() => {
                    Auth.signOut();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <SignInWithGoogle />
        )}
      </div>
    </div>
  );
};

export default NavBar;
