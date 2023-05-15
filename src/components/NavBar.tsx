import React, { useEffect, useState } from "react";
import DubeButton from "./widgets/Button";
import { useNavigate } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import SignInWithGoogle from "./GoogleSignIn/SignInWithGoogle";
import { useAtom } from "jotai";
import { locationAtom, useSyncedAtom } from "store/locationStore";

const NavBar = () => {
  const [location, setLocation] = useSyncedAtom(locationAtom);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const toggleDropDown = () => {
    setOpen(!open);
  };

  useEffect(() => {
    console.log(user);
    user &&
      window.localStorage.setItem(
        "sessionToken",
        user.signInUserSession.accessToken.jwtToken
      );
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
          console.log(data);
          break;
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, [!user]);

  async function getUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      return userData;
    } catch {
      return console.log("Not signed in");
    }
  }
  return (
    <div className="navbar bg-blue-900">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-slate-100 hover:bg-gradient-to-r from-blue-800 to-blue-400">
          Dube
        </a>
      </div>
      <div className="flex-none gap-5 pr-5">
        {/* Location Button */}

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
                    locationName: "San Fransisco",
                    locationId: "sf",
                  });
                  setOpen(!open);
                }}
              >
                San Franciso
              </li>
              <li
                className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                onClick={() => {
                  setLocation({
                    locationName: "Singapore",
                    locationId: "sg",
                  });
                  setOpen(!open);
                }}
              >
                Singapore
              </li>
              <li
                className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                // className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover:text-black border-primary-content flex-row justify-start"
                onClick={() => {
                  setLocation({
                    locationName: "India",
                    locationId: "in",
                  });
                  setOpen(!open);
                }}
              >
                India
              </li>
              <li
                className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                onClick={() => {
                  setLocation({
                    locationName: "China",
                    locationId: "cn",
                  });
                  setOpen(!open);
                }}
              >
                China
              </li>
            </ul>
          )}
        </div>

        {/* Location Button    */}

        <DubeButton
          onClick={() => navigate("/scan")}
          title="Scan"
          primary={false}
        />
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
                <a className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100">
                  Profile
                  <span className="badge bg-blue-800 border-none">New</span>
                </a>
              </li>
              <li>
                <a className="btn bg-primary-content text-slate-400 hover:bg-primary-content hover:border-primary-content hover: border-primary-content hover: flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100">
                  Settings
                </a>
              </li>
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
