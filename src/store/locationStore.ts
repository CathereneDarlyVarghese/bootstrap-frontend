import { PrimitiveAtom, atom, useAtom } from "jotai";
import { useEffect } from "react";

export type LocationType = {
  locationName: string;
  locationId: string;
};

const initialLocation: LocationType = JSON.parse(
  window.localStorage.getItem("location") ||
    '{"locationName": "No Locations", "locationId": "4d064c86-9ba7-47fb-bdaa-ac84769dd2df"}'
);

export const locationAtom = atom<LocationType>(initialLocation);

export const useSyncedAtom = (atom: PrimitiveAtom<LocationType>) => {
  const [state, setState] = useAtom(atom);

  useEffect(() => {
    localStorage.setItem("location", JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
};
