import { PrimitiveAtom, atom, useAtom } from "jotai";
import { useEffect } from "react";

type LocationType = {
  locationName: string;
  locationId: string;
};

export const locationAtom = atom<LocationType>({
  locationName: "The Spiffy Dapper",
  locationId: "tsd",
});

export const useSyncedAtom = (atom: PrimitiveAtom<LocationType>) => {
  const [state, setState] = useAtom(atom);

  useEffect(() => {
    localStorage.setItem("location", JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
};
