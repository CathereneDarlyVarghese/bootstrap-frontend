import { useEffect, useMemo, useState } from 'react';
import { atom, useAtom } from 'jotai';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { locationAtom, useSyncedAtom } from 'store/locationStore';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AssetLocation } from 'types';
import SignInWithGoogle from './LoginPage/SignInWithGoogle';
import { getAssetLocationByOrgId } from '../services/locationServices';
import { getUserByEmail } from '../services/userServices';
import { resetFilterOptions } from './LandingPage/FilterOptions';
import Logo from '../icons/Logo(2).svg';
import ScanButton from './widgets/ScanButton';
import AddLocationForm from './AddLocationForm';

export const LogoClickedAtom = atom(false);

const NavBar = () => {
  const routePage = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // States
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [authToken, setAuthToken] = useSyncedGenericAtom(
    genericAtom,
    'authToken',
  );
  const [locations, setLocations] = useState<AssetLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [, setIsLoading] = useState(true);
  const [addLocationForm, setAddLocationForm] = useState(false);
  const [, setLogoClicked] = useAtom(LogoClickedAtom);

  // Extract locationId from the URL's search params.
  const searchParams = new URLSearchParams(routePage.search);
  const urlLocationId = searchParams.get('location_id');
  const [activeTab, setActiveTab] = useState(0);

  // Toggle dropdown state
  const toggleDropDown = () => {
    setOpen(!open);
  };

  const TABS = useMemo(
    () => ({
      '/home': 1,
      '/work-orders': 2,
      '/document/location': 3,
      '/status-checks': 4,
    }),
    [],
  );

  // Effect: Update class based on route
  useEffect(() => {
    Object.keys(TABS).forEach(path => {
      if (routePage.pathname === path) {
        setActiveTab(TABS[path]);
      }
    });
  }, [routePage, TABS]);

  // Authentication and Global Variable
  useQuery({
    queryKey: ['query-auth'],
    queryFn: async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        window.localStorage.setItem(
          'sessionToken',
          userData.signInUserSession.idToken.jwtToken,
        );
        setAuthToken({
          authToken: userData.signInUserSession.idToken.jwtToken,
          attributes: userData.attributes,
        });

        const userInfo = await getUserByEmail(
          userData.signInUserSession.idToken.jwtToken,
          userData.attributes.email,
        );
        queryClient.setQueryData(['query-user'], userInfo);
        userData.attributes.org_id = userInfo.org_id;
        setUser(userData);

        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    },
    staleTime: 60000 * 10,
  });

  // we can remove the sub id and use email as primary key

  // UseQuery to get locations
  useQuery({
    queryKey: ['query-locations', urlLocationId],
    queryFn: async () => {
      const locationData = await getAssetLocationByOrgId(
        user.signInUserSession.idToken.jwtToken,
        user.attributes.org_id,
      );
      queryClient.setQueryData(['query-locations'], locationData);
      setLocations(locationData);

      if (urlLocationId) {
        // Find the location with the specified ID from the URL.
        const urlLocation = locationData.find(
          loc => loc.location_id === urlLocationId,
        );
        if (urlLocation) {
          setLocation({
            locationName: urlLocation.location_name,
            locationId: urlLocation.location_id,
          });
          return;
        }
      }

      if (!location.locationId) {
        if (locationData.length > 0) {
          setLocation({
            locationName: locationData[0].location_name,
            locationId: locationData[0].location_id,
          });
        }
      }
    },
    enabled:
      !!authToken && !!user && !!user.attributes && !!user.attributes.org_id,
  });

  return (
    <>
      <div className="navbar bg-blue-900">
        <div className="flex-1">
          <button
            onClick={() => {
              navigate('/home');
              resetFilterOptions();
              setLogoClicked(true);
            }}
            className="btn btn-ghost normal-case text-xl text-slate-100"
          >
            <img src={Logo} alt="Logo I presume" />
          </button>
          <div className="tabs ml-10 lg:hidden">
            <button
              className={`tab text-white border border-transparent ${
                activeTab === 1 ? 'border-b-white' : ''
              } font-sans mx-3 asset-tab`}
              onClick={() => {
                navigate('/home');
                resetFilterOptions();
                setActiveTab(1);
              }}
            >
              Assets
            </button>

            <button
              className={`tab text-white border border-transparent ${
                activeTab === 2 ? 'border-b-white' : ''
              } font-sans workorder-tab`}
              onClick={() => {
                navigate('/work-orders');
                setActiveTab(2);
              }}
            >
              Maintenance
            </button>
            <button
              className={`tab text-white border border-transparent ${
                activeTab === 3 ? 'border-b-white' : ''
              } font-sans documents-tab`}
              onClick={() => {
                navigate('/document/location');
                setActiveTab(3);
              }}
            >
              Documents
            </button>
            <button
              className={`tab text-white border border-transparent ${
                activeTab === 4 ? 'border-b-white' : ''
              } font-sans status-tab`}
              onClick={() => {
                navigate('/status-checks');
                setActiveTab(4);
              }}
            >
              Status
            </button>
          </div>
          {/* <ThemeSwitcher /> */}
        </div>

        <div className="flex-none gap-5 md:gap-2 ">
          {/* Scan Button */}
          {user && (
            <ScanButton
              onClick={() => {
                navigate('/scan');
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
                {location.locationName !== ''
                  ? location.locationName
                  : 'Not Selected'}
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
                {locations.map(item => (
                  <li
                    key={item.location_id}
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-start hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                    onClick={() => {
                      setLocation({
                        locationName: item.location_name,
                        locationId: item.location_id,
                      });
                      window.localStorage.setItem(
                        'location',
                        JSON.stringify(location),
                      );
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
                  <img
                    alt="random avatar"
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
                    href="/admin"
                    className="btn bg-primary-content dark:bg-gray-700 border-0 text-slate-400 dark:text-white hover:bg-primary-content flex-row justify-between hover:bg-gradient-to-r from-blue-800 to-blue-400 hover:text-slate-100"
                  >
                    Admin
                  </a>
                </li>
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
