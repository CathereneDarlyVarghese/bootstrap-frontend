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
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd"; // you can use any other theme you prefer
import { Auth } from "aws-amplify";
import "./formstyles.css";
import useStatusTypeNames from "hooks/useStatusTypes";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { useMutation, useQueryClient } from 'react-query';


const AddStatusFormSchema = {
  //DishWasher status check form
  operational: {
    "ui:widget": "radio",
  },
  clean: {
    "ui:widget": "radio",
  },
  defrost: {
    "ui:widget": "radio",
  },
  condition: {
    "ui:widget": "radio",
  },
  cleanliness: {
    "ui:widget": "radio",
  },
  hygieneCheck: {
    "ui:widget": "radio",
  },
  debrisCheck: {
    "ui:widget": "radio",
  },
  waterPointsCheck: {
    "ui:widget": "radio",
  },
  testRunCheck: {
    "ui:widget": "radio",
  },

  // Furniture Status Check
  upholstery: {
    "ui:widget": "radio",
  },
  stability: {
    "ui:widget": "radio",
  },

  // Chiller Status Check
  freshProduceCheck: {
    "ui:widget": "radio",
  },
  productsLabelledAndDated: {
    "ui:widget": "radio",
  },
  hygieneAndCleanliness: {
    "ui:widget": "radio",
  },

  //Wine Chiller Status Check
  temperatureCheck: {
    "ui:widget": "radio",
  },
  productLabelDateCheck: {
    "ui:widget": "radio",
  },
  cleanlinessCheck: {
    "ui:widget": "radio",
  },
};

const AddStatusForm = ({
  addFormOpen,
  setAddFormOpen,
  assetId,
  onStatusAdded,
  assetType,
  assetTypeId,
}) => {
  const Form = withTheme(AntDTheme);
  const [, setFormDataState] = useState<any>({});
  const [reportIssue, setReportIssue] = useState(false);
  const [jsonForm, setJsonForm] = useState(null);
  const now = new Date();
  // const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [file, ] = useState<any>();
  const [name, ] = useState<string>("");
  const statusTypeNames = useStatusTypeNames();
  const [authTokenObj, ] = useSyncedGenericAtom(genericAtom, "authToken");

  const queryClient = useQueryClient();

  const assetCheckAddMutation = useMutation((assetCheck:any) =>
      createAssetCheck(authTokenObj.authToken, assetCheck),
    {
      onSettled: () => {
        toast.success("Asset Check Added Successfully", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        onStatusAdded();
        queryClient.invalidateQueries(["query-assetChecks"]);
      },
      onError: (err: any) => {
        toast.error("Failed to Delete Asset's Status Check")
      }
    }
  );
  
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getAssetCheckFormById(authTokenObj.authToken, assetTypeId);
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
    if (reportIssue) {
      try {
        const imageLocation = await uploadFiletoS3(file, "assetCheck");

        const userData = await Auth.currentAuthenticatedUser();
        const modifiedBy = userData.attributes.given_name;
        const modifiedDate = new Date().toISOString().substring(0, 10);

        const createdFile = await createFile(authTokenObj.authToken, {
          file_id: "",
          file_array: [imageLocation.location],
          modified_by_array: [modifiedBy],
          modified_date_array: [modifiedDate],
        });

        const assetCheck = {
          uptime_check_id: "",
          asset_id: assetId,
          status_check: statusUUID,
          file_id: String(createdFile),
          uptime_notes: formData.uptime_notes as string,
          modified_by: name,
          modified_date: new Date(),
          status_check_data: JSON.parse(JSON.stringify(formData)),
        };

        // Add inventory using the API service
        assetCheckAddMutation.mutateAsync(assetCheck);
        
      } catch (error) {
        toast.error("Failed to add asset");
      }
    } else {
      // Case when there is no issue
      const assetCheck = {
        uptime_check_id: "",
        asset_id: assetId,
        status_check: statusUUID,
        file_id: null,
        uptime_notes: null,
        modified_by: name,
        modified_date: new Date(),
        status_check_data: JSON.parse(JSON.stringify(formData)),
      };

      try {
        // Add inventory using the API service
        assetCheckAddMutation.mutateAsync(assetCheck);

      } catch (error) {
        toast.error("Failed to add asset");
      }
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
                uiSchema={AddStatusFormSchema}
                onSubmit={({ formData }) => {
                  setFormDataState(formData);
                  handleSubmit(formData);
                  setAddFormOpen(false);
                  setReportIssue(false);
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
