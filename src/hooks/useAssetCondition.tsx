import { AssetCondition } from "enums";

const useAssetCondition = () => ({
  [AssetCondition.ACTIVE]: "ACTIVE",
  [AssetCondition.INACTIVE]: "INACTIVE",
});

export default useAssetCondition;
