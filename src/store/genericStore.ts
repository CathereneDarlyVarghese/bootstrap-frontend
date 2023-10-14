import { PrimitiveAtom, atom, useAtom } from "jotai";
import { useEffect } from "react";
// import { atomWithStorage } from 'jotai/utils'

// const tokenIdStorageAtom = atomWithStorage('tokenId', "")

// eslint-disable-next-line
export const genericAtom = atom<any>({});
// eslint-disable-next-line
export const useSyncedGenericAtom = (atomObj: PrimitiveAtom<any>, storeKey:string) => {
  const [state, setState] = useAtom(atomObj);

  useEffect(() => {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }, [state, storeKey]);

  return [state, setState] as const;
};
