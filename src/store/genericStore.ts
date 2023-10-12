import { PrimitiveAtom, atom, useAtom } from "jotai";
import { useEffect } from "react";
// import { atomWithStorage } from 'jotai/utils'

// const tokenIdStorageAtom = atomWithStorage('tokenId', "")

export const genericAtom = atom<any>({});
export const useSyncedGenericAtom = (atomObj: PrimitiveAtom<any>, storeKey:string) => {
  const [state, setState] = useAtom(atomObj);

  useEffect(() => {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }, [state, storeKey]);

  return [state, setState] as const;
};
