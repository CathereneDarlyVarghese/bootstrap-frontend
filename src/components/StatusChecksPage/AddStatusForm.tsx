import { useEffect, useState } from "react";
import validator from "@rjsf/validator-ajv8";
import { uploadFiletoS3 } from "utils";
import { toast } from "react-toastify";
import { createAssetCheck } from "services/assetCheckServices";
import { createFile } from "services/fileServices";
import { TfiClose } from "react-icons/tfi";
import {
  createAssetCheckForm,
  getAssetCheckFormById,
} from "services/assetCheckFormServices";
import Form from "@rjsf/core";
import "./formstyles.css";
import useStatusTypeNames from "hooks/useStatusTypes";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useMutation, useQueryClient } from "react-query";

const AddStatusForm = ({
  addFormOpen,
  setAddFormOpen,
  assetId,
  onStatusAdded,
  assetType,
  assetTypeId,
}) => {
  const [, setFormDataState] = useState<any>({});
  const [jsonForm, setJsonForm] = useState(null);
  const now = new Date();
  // const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [file] = useState<any>();
  const [name] = useState<string>("");
  const statusTypeNames = useStatusTypeNames();
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

  const queryClient = useQueryClient();

  const assetCheckAddMutation = useMutation(
    (assetCheck: any) => createAssetCheck(authTokenObj.authToken, assetCheck),
    {
      onSettled: () => {
        toast.success("Asset Check Added Successfully");
        onStatusAdded();
        queryClient.invalidateQueries(["query-asset"]);
        queryClient.invalidateQueries(["query-assetChecks"]);
      },
      onError: (err: any) => {
        toast.error("Failed to Delete Asset's Status Check");
      },
    }
  );

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getAssetCheckFormById(
          authTokenObj.authToken,
          assetTypeId
        );
        setJsonForm(form.form_json); // Adjust this line according to your returned data structure
      } catch (error) {
        if (error.response?.status === 404) {
          try {
            const newForm = await createAssetCheckForm(authTokenObj.authToken, {
              form_json: {},
              asset_type_id: assetTypeId,
            });
            setJsonForm(newForm.form_json); // Adjust this line according to your returned data structure
          } catch (error) {
            console.error("Failed to create a new form:", error);
          }
        } else {
          console.error("Failed to fetch form:", error);
        }
      }
    };

    if (assetType) {
      fetchForm();
    }
  }, [assetType, assetTypeId]);

  function getKeyByValue(object: Record<string, string>, value: string) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  const handleSubmit = async (formData: any) => {
    const statusUUID = getKeyByValue(statusTypeNames, formData.operational);

    console.log("Modified by==>", authTokenObj.attributes.given_name);
    const assetCheck = {
      uptime_check_id: "",
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
      toast.error("Failed to add asset");
    }

    // Log the form submission
    console.log("Form submitted:", formData);
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
              onClick={(e) => {
                e.preventDefault();
                setAddFormOpen(false);
              }}
            >
              <TfiClose className="font-bold text-blue-800 dark:text-blue-500" />
            </button>
          </div>

          <div className="px-5 bg-white dark:bg-transparent text-black dark:text-white">
            {/* The form generated from the JSON Schema */}
            {jsonForm && (
              <Form
                schema={jsonForm}
                validator={validator}
                onSubmit={({ formData }) => {
                  setFormDataState(formData);
                  handleSubmit(formData);
                  setAddFormOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStatusForm;
