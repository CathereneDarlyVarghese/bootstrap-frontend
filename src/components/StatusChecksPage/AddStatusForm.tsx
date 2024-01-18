import { useEffect, useState } from 'react';
import validator from '@rjsf/validator-ajv8';
import { toast } from 'react-toastify';
import { TfiClose } from 'react-icons/tfi';
import {
  createAssetCheckForm,
  getAssetCheckFormById,
} from 'services/assetCheckFormServices';
import {
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader,
} from '@react-form-builder/components-rsuite';
import './formstyles.css';
import useStatusTypeNames from 'hooks/useStatusTypes';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetCheck } from 'types';
import {
  ActionDefinition,
  BiDi,
  ComponentLocalizer,
  createView,
  FormViewer,
  IFormViewer,
  Validators,
} from '@react-form-builder/core';
import { createAssetCheck } from 'services/assetCheckServices';

interface AddStatusFormProps {
  addFormOpen: boolean;
  setAddFormOpen: (boolean) => void;
  assetId: string;
  assetType: string;
  assetTypeId: string;
}

const AddStatusForm: React.FC<AddStatusFormProps> = ({
  addFormOpen,
  setAddFormOpen,
  assetId,
  assetType,
  assetTypeId,
}) => {
  // State initialization
  const [, setFormDataState] = useState<any>({}); // eslint-disable-line
  const [jsonForm, setJsonForm] = useState(null);
  const componentsMetadata = rSuiteComponents.map(
    definer => definer.build().model,
  );

  const view = createView(componentsMetadata)
    .withViewerWrapper(RsLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader);

  const now = new Date(); // Current date and time

  const statusTypeNames = useStatusTypeNames();

  // Fetch authentication token
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');

  // Using the query client for server communication
  const queryClient = useQueryClient();

  // Mutation for adding an asset check
  const assetCheckAddMutation = useMutation({
    mutationFn: (assetCheck: AssetCheck) =>
      createAssetCheck(authTokenObj.authToken, assetCheck),

    onSettled: () => {
      toast.success('Asset Check Added Successfully');
      // Invalidate cache to ensure fresh data is fetched next time
      queryClient.invalidateQueries(['query-asset']);
      queryClient.invalidateQueries(['query-assetChecks']);
    },

    onError: () => {
      toast.error('Failed to Add Status Check');
    },
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getAssetCheckFormById(
          authTokenObj.authToken,
          assetTypeId,
        );
        setJsonForm(form.form_json);
      } catch (error) {
        if (error.response?.status === 404) {
          const newForm = await createAssetCheckForm(authTokenObj.authToken, {
            form_json: {},
            asset_type_id: assetTypeId,
          });
          setJsonForm(newForm.form_json);
        }
      }
    };

    if (assetType) {
      fetchForm();
    }
  }, [assetType, assetTypeId, authTokenObj.authToken]);

  function getKeyByValue(object: Record<string, string>, value: string) {
    return Object.keys(object).find(key => object[key] === value);
  }

  // eslint-disable-next-line
  const handleSubmit = async (formData: any) => {
    // eslint-disable-line
    const statusUUID = getKeyByValue(statusTypeNames, formData.operational);

    const assetCheck = {
      uptime_check_id: '',
      asset_id: assetId,
      status_check: statusUUID,
      file_id: null,
      uptime_notes: null,
      modified_by: authTokenObj.attributes.given_name,
      modified_date: new Date(),
      status_check_data: JSON.parse(JSON.stringify(formData)),
    };

    try {
      // Add inventory using the API service
      assetCheckAddMutation.mutateAsync(assetCheck);
    } catch (error) {
      toast.error('Failed to add asset');
    }
  };

  return (
    <>
      {/* Checkbox for modal toggle */}
      <input
        type="checkbox"
        checked={addFormOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className=" z-50">
        <div className=" z-50 p-0 bg-white dark:bg-gray-800 w-full sm:mx-2">
          {/* Modal header */}
          <div className="p-5 bg-white dark:bg-gray-800 flex flex-row">
            <h3 className="font-sans font-bold text-lg text-blue-800 dark:text-blue-600">
              Status Check {now.toLocaleDateString()}
            </h3>
            <button
              className="ml-auto"
              onClick={e => {
                e.preventDefault();
                setAddFormOpen(false);
              }}
            >
              <TfiClose className="font-bold text-blue-800 dark:text-blue-500" />
            </button>
          </div>

          <div className="px-5 bg-white dark:bg-transparent text-black dark:text-white">
            {/* The form generated from the JSON Schema */}
            {/* {jsonForm && (
              <Form
                schema={jsonForm}
                validator={validator}
                onSubmit={({ formData }) => {
                  setFormDataState(formData);
                  handleSubmit(formData);
                  setAddFormOpen(false);
                }}
              />
              )} */}
            <FormViewer view={view} getForm={() => JSON.stringify(jsonForm)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStatusForm;
