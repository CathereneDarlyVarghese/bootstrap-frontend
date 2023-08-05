import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import SignInWithGoogle from "./GoogleSignIn/SignInWithGoogle";
import { locationAtom, useSyncedAtom } from "store/locationStore";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { getAllAssetLocations } from "../services/locationServices";
import { resetFilterOptions } from "./LandingPage/FilterOptions";

import B from "../icons/B.svg";
import ootstrap from "../icons/ootstrap.svg";
import ScanButton from "./widgets/ScanButton";
import { GiHamburgerMenu } from "react-icons/gi";
import AddLocationForm from "./AddLocationForm";
import ThemeSwitcher from "./ThemeSwitcher";


const NavBar = () => {
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [, setAuthToken] = useSyncedGenericAtom(genericAtom, "authToken");
  const [locations, setLocations] = useState(null);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [, setIsLoading] = useState(true);
  const [addLocationForm, setAddLocationForm] = useState(false);

  const [, setSessionToken] = useState<string | null>(null);


  const routePage = useLocation();

  const toggleDropDown = () => {
    setOpen(!open);
  };

  //function to add and remove class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };
  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
  };

  useEffect(() => {
    if (routePage.pathname === "/home") {
      addClass(".asset-tab", "border-b-white");
      removeClass(".documents-tab", "border-b-white");
      removeClass(".workorder-tab", "border-b-white");
      removeClass(".status-tab", "border-b-white");
    } else if (routePage.pathname === "/work-orders") {
      addClass(".workorder-tab", "border-b-white");
      removeClass(".asset-tab", "border-b-white");
      removeClass(".documents-tab", "border-b-white");
      removeClass(".status-tab", "border-b-white");
    } else if (routePage.pathname === "/document/location") {
      addClass(".documents-tab", "border-b-white");
      removeClass(".workorder-tab", "border-b-white");
      removeClass(".asset-tab", "border-b-white");
      removeClass(".status-tab", "border-b-white");
    } else if (routePage.pathname === "/status-checks") {
      addClass(".status-tab", "border-b-white");
      removeClass(".documents-tab", "border-b-white");
      removeClass(".workorder-tab", "border-b-white");
      removeClass(".asset-tab", "border-b-white");
    }
  }, [routePage]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUser(userData);
        window.localStorage.setItem(
          "sessionToken",
          userData.signInUserSession.accessToken.jwtToken
        );
        setAuthToken({"authToken": userData.signInUserSession.accessToken.jwtToken});

        setIsLoading(false);
      } catch {
        console.log("Not signed in");
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setSessionToken(userData.signInUserSession.idToken.jwtToken);
        const locationData = await getAllAssetLocations(
          userData.signInUserSession.idToken.jwtToken
        );
        setLocations(locationData);
        if (locationData.length > 0) {
          setLocation({
            locationName: locationData[0].location_name,
            locationId: locationData[0].location_id,
          });
        }
        console.log("locations fetched", locationData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <>
      {/* {console.log("locations fetched")} */}
      <div className="navbar bg-blue-900">
        <div className="flex-1">
          <button
            onClick={() => {
              navigate("/");
              resetFilterOptions();
            }}
            className="btn btn-ghost normal-case text-xl text-slate-100"
          >
            <img src={B} alt="Logo I presume" />
            <img src={ootstrap} alt="Logo I presume"/>

            {/* <h1>ootstrap</h1> */}
            {/* Bootstrap */}
          </button>
          <div className="tabs ml-10 lg:hidden">
            <button
              className="tab text-white border border-transparent border-b-white font-sans mx-3 asset-tab"
              onClick={() => {
                navigate("/home");
                resetFilterOptions();
              }}
            >
              Assets
            </button>

            <button
              className="tab text-white border border-transparent font-sans workorder-tab"
              onClick={() => {
                navigate("/work-orders");
              }}
            >
              Maintenance
            </button>
            <button
              className="tab text-white border border-transparent font-sans documents-tab"
              onClick={() => {
                navigate("/document/location");
              }}
            >
              Documents
            </button>
            <button
              className="tab text-white border border-transparent font-sans status-tab"
              onClick={() => {
                navigate("/status-checks");
              }}
            >
              Status
            </button>
          </div>
          <ThemeSwitcher />
        </div>

        <div className="flex-none gap-5 md:gap-2 ">
          {/* Location Button */}
          {user && (
            <ScanButton
              onClick={() => {
                navigate("/scan");
              }}
            />
          )}

          <div className="dropdown dropdown-bottom dropdown-end">
            <label
              className="btn-sm px-5 btn w-fill btn-primary rounded-lg font-semibold focus:outline-none bg-blue-800 border-none hover:bg-gradient-to-r from-blue-800 to-blue-400 md:px-3"
              tabIndex={0}
              onClick={toggleDropDown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 m-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <div className="md:hidden">
                {locations ? location.locationName : "No Locations"}
              </div>
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
            {open && locations && locations.length > 0 && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 dark:bg-gray-700 rounded-box w-52"
              >
                {locations.map((item) => (
                  <li
                    key={item.location_id}
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                    onClick={() => {
                      setLocation({
                        locationName: item.location_name,
                        locationId: item.location_id,
                      });
                      setOpen(!open);
                    }}
                  >
                    {item.location_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Location Button    */}

          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div>
                  <img alt="random avatar"
                    className="rounded-full md:hidden 2xl:block "
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                  <GiHamburgerMenu className="text-xl text-white md:block 2xl:hidden" />
                </div>
                <div></div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 dark:bg-gray-700 rounded-box w-52"
              >
                <li>
                  <a
                    href="/home"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100 2xl:hidden lg:flex"
                  >
                    Assets
                  </a>
                </li>
                <li>
                  <a
                    href="/work-orders"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100 2xl:hidden lg:flex"
                  >
                    Maintenance
                  </a>
                </li>
                <li>
                  <a
                    href="/document/location"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100 2xl:hidden lg:flex"
                  >
                    Documents
                  </a>
                </li>
                <li>
                  <a
                    href="/status-checks"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100 2xl:hidden lg:flex"
                  >
                    Status Checks
                  </a>
                </li>
                <li>
                  <a
                    href="/location"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                    onClick={() => {
                      setAddLocationForm(true);
                    }}
                  >
                    Add Location
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
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
            <div className="">
              <SignInWithGoogle />
            </div>
          )}
        </div>
      </div>
      <div>
        <AddLocationForm
          addLocationForm={addLocationForm}
          setAddLocationForm={setAddLocationForm}
        />
      </div>
    </>
  );
};

export default NavBar;
