import { AssetCondition } from "enums";

const useAssetCondition = () => {
  return {
    [AssetCondition.ACTIVE]: "ACTIVE",
    [AssetCondition.INACTIVE]: "INACTIVE",
  };
};

export default useAssetCondition;
