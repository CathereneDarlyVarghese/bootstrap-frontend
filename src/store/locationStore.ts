import { PrimitiveAtom, atom, useAtom } from "jotai";
import { useEffect } from "react";

export type AssetLocation = {
  locationName: string;
  locationId: string;
};

const initialLocation: AssetLocation = JSON.parse(
  window.localStorage.getItem("location") 
  || '{"locationName": "No Locations", "locationId": "4d064c86-9ba7-47fb-bdaa-ac84769dd2df"}',
);

export const locationAtom = atom<AssetLocation>(initialLocation);

export const useSyncedAtom = (atomObj: PrimitiveAtom<AssetLocation>) => {
  const [state, setState] = useAtom(atomObj);

  useEffect(() => {
    localStorage.setItem("location", JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
};
