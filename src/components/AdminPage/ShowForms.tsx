import React from "react";
import Form from "react-jsonschema-form";
import { AssetType } from "types";

interface ShowFormsProps {
  assetTypes: AssetType[];
  selectedAssetType: string | null;
  setSelectedAssetType: (value: string) => void;
  jsonForm: any;
}

const ShowForms: React.FC<ShowFormsProps> = ({
  assetTypes,
  selectedAssetType,
  setSelectedAssetType,
  jsonForm,
}) => (
  <div>
    <div className="flex flex-col justify-center">
      <select
        value={selectedAssetType}
        onChange={(e) => setSelectedAssetType(e.target.value)}
        className="select border border-slate-300 w-5/12 mx-auto my-5"
      >
        {assetTypes.map((type) => (
          <option
            key={type.asset_type_id}
            value={type.asset_type_id}
            className="text-black"
          >
            {type.asset_type}
          </option>
        ))}
      </select>
    </div>
    <div style={{ marginBottom: 70 }}>
      {jsonForm && <Form schema={jsonForm} />}
    </div>
  </div>
);

export default ShowForms;
