import {
  ltrCssLoader,
  rsErrorMessage,
  RsLocalizationWrapper,
  rsTooltip,
  rSuiteComponents,
  rtlCssLoader,
} from '@react-form-builder/components-rsuite';
import { BiDi } from '@react-form-builder/core';
import { BuilderView, FormBuilder } from '@react-form-builder/designer';
import { useEffect, useState } from 'react';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import {
  createAssetCheckForm,
  getAssetCheckFormById,
} from 'services/assetCheckFormServices';
import { getAllAssetTypes } from 'services/assetTypeServices';
import { useQuery } from '@tanstack/react-query';
import * as SampleForm from './SampleForm.json';

interface AssetType {
  asset_type_id: string;
  asset_type: string;
}
type QueryError = any;
const builderComponents = rSuiteComponents.map(c => c.build());
const builderView = new BuilderView(builderComponents)
  .withErrorMeta(rsErrorMessage.build())
  .withTooltipMeta(rsTooltip.build())
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader);

const getForm = (_?: string) => JSON.stringify(SampleForm);

const FormBuilderExample = () => {
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [jsonForm, setJsonForm] = useState<any>(null);

  const { data: assetTypesData } = useQuery<AssetType[]>({
    queryKey: ['query-assetTypesAdmin'],
    queryFn: () => getAllAssetTypes(authTokenObj.authToken),
    enabled: !!authTokenObj.authToken,
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getAssetCheckFormById(
          authTokenObj.authToken,
          selectedAssetType,
        );
        setJsonForm(form.form_json);
        console.log('form fetched', form);
      } catch (error) {
        if (error.response?.status === 404) {
          const newForm = await createAssetCheckForm(authTokenObj.authToken, {
            form_json: { getForm },
            asset_type_id: selectedAssetType,
          });
          setJsonForm(newForm.form_json);
        }
      }
    };

    if (selectedAssetType) {
      fetchForm();
    }
  }, [selectedAssetType, authTokenObj.authToken]);

  return (
    <div
      style={{
        paddingLeft: '300px',
        paddingRight: '300px',
        paddingBottom: '700px',
      }}
    >
      <div>
        <div className="flex flex-row items-center">
          <h3 className="font-bold text-lg">Asset Type</h3>
        </div>
        <select
          value={selectedAssetType}
          onChange={e => {
            setSelectedAssetType(e.target.value);
            console.log('Value', e.target.value);
          }}
          className="input input-sm w-full border border-slate-300 my-5"
        >
          <option value="" disabled>
            Select an Asset Type
          </option>
          {assetTypesData?.map((assetTypeObj: AssetType) => (
            <option
              key={assetTypeObj.asset_type_id}
              value={assetTypeObj.asset_type_id}
            >
              {assetTypeObj.asset_type}
            </option>
          ))}
        </select>
      </div>
      <FormBuilder
        view={builderView}
        formName="SampleForm"
        getForm={() => JSON.stringify(jsonForm)}
      />
      <button className="btn-primary">Update form</button>
    </div>
  );
};

export default FormBuilderExample;
