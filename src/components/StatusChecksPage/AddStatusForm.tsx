import { useEffect, useRef, useState } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import { Asset, AssetCheck } from "types";
import validator from "@rjsf/validator-ajv8";
import { AssetTypes } from "enums";
import Form from "react-jsonschema-form";
import { uploadFiletoS3 } from "utils";
import { addInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { createAssetCheck } from "services/assetCheckServices";
import { createFile } from "services/fileServices";
import useStatusTypeNames from "hooks/useStatusTypes";
import { AiOutlinePaperClip } from "react-icons/ai";
import { TfiClose } from "react-icons/tfi";
import {
  createAssetCheckForm,
  getAssetCheckFormById,
} from "services/assetCheckFormServices";
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd"; // you can use any other theme you prefer
import { Auth } from "aws-amplify";
import "./formstyles.css"


const AddStatusFormSchema = {
  "operational": {
    "ui:widget": "radio"
  },
  "clean": {
    "ui:widget": "radio"
  },
  "defrost": {
    "ui:widget": "radio"
  },
  "condition": {
    "ui:widget": "radio"
  },
  "cleanliness": {
    "ui:widget": "radio"
  }


}

const AddStatusForm = ({
  addFormOpen,
  setAddFormOpen,
  assetId,
  onStatusAdded,
  assetType,
  assetTypeId,
}) => {
  const Form = withTheme(AntDTheme);
  // Custom hook to fetch asset type names
  const assetTypeNames = useAssetTypeNames();
  const [formDataState, setFormDataState] = useState<any>({});
  const [token, setToken] = useState<string>("");
  const [reportIssue, setReportIssue] = useState(false);
  const [jsonForm, setJsonForm] = useState(null);
  const now = new Date();
  const statusTypeNames = useStatusTypeNames();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<any>();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchCredentials = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      setToken(userData.signInUserSession.accessToken.jwtToken);
      setName(userData.attributes.given_name);
    };
    fetchCredentials();
  }, []);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getAssetCheckFormById(token, assetTypeId);
        setJsonForm(form.form_json); // Adjust this line according to your returned data structure
      } catch (error) {
        if (error.response?.status === 404) {
          try {
            const newForm = await createAssetCheckForm(token, {
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
  }, [assetType, token]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleSubmit = async (formData: any) => {
    // event.preventDefault();

    // const formData = new FormData(formRef.current);

    if (reportIssue) {
      // Case when reporting an issue
      try {
        // Upload file to S3 bucket
        const imageLocation = await uploadFiletoS3(file, "assetCheck");

        const userData = await Auth.currentAuthenticatedUser();
        const modifiedBy = userData.attributes.given_name;
        const modifiedDate = new Date().toISOString().substring(0, 10);

        const createdFile = await createFile(token, {
          file_id: "",
          file_array: [imageLocation.location],
          modified_by_array: [modifiedBy],
          modified_date_array: [modifiedDate]
        });

        const assetCheck = {
          uptime_check_id: "",
          asset_id: assetId,
          status_check: selectedStatus,
          file_id: String(createdFile),
          uptime_notes: formData.uptime_notes as string,
          modified_by: name,
          modified_date: new Date(),
          status_check_data: JSON.parse(JSON.stringify(formData)),
        };

        // Add inventory using the API service
        await createAssetCheck(token, assetCheck);
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
      } catch (error) {
        toast.error("Failed to add asset");
      }
    } else {
      console.log("reportIssue", reportIssue);
      // Case when there is no issue
      const assetCheck = {
        uptime_check_id: "",
        asset_id: assetId,
        status_check: "ca879fb3-2f94-41b0-afb2-dea1448aaed3",
        file_id: null,
        uptime_notes: "Working Fine",
        modified_by: name,
        modified_date: new Date(),
        status_check_data: JSON.parse(JSON.stringify(formData)),
      };
      console.log("Token >>", token);

      try {
        // Add inventory using the API service
        await createAssetCheck(token, assetCheck);
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
      } catch (error) {
        toast.error("Failed to add asset");
      }
    }

    // Log the form submission
    console.log("Form submitted:", formData);
  };

  // Function to close the add asset form
  const closeAddForm = () => {
    setAddFormOpen(false);
  };

  //function to add and remove class for UI
  const addClass = (selectClass, addClass) => {
    document.querySelector(selectClass).classList.add(addClass);
  };
  const removeClass = (selectClass, removeClass) => {
    document.querySelector(selectClass).classList.remove(removeClass);
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
      <div className="modal z-50">
        <div className="modal-box z-50 p-0 bg-white dark:bg-gray-800 w-full sm:mx-2">
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

          <div className="px-5">
            {/* The form generated from the JSON Schema */}
            {jsonForm && (
              <Form
                schema={jsonForm}
                validator={validator}
                uiSchema={AddStatusFormSchema}
                onSubmit={({ formData }) => {
                  console.log("Data submitted: ", formData);
                  setFormDataState(formData);
                  handleSubmit(formData);
                  setAddFormOpen(false);
                  setReportIssue(false);
                }}
              />
            )}
          </div>

          {/* Modal action */}
          {/* <div className=" m-0 p-5 flex justify-center gap-5">
            <div>
              {reportIssue || (
                <button
                  className="btn bg-blue-900 hover:bg-blue-900 capitalize"
                  onClick={(e) => {
                    e.preventDefault();
                    setReportIssue(true);
                  }}
                >
                  Report Issue
                </button>
              )}
            </div>
            <div>
              <button
                className="btn bg-blue-900 hover:bg-blue-900 capitalize"
                type="submit"
                onClick={(e) => {
                  handleSubmit(e);
                  setAddFormOpen(false);
                  setReportIssue(false);
                }}
              >
                {reportIssue ? "Submit" : "Fine"}
              </button>
            </div>
          </div> 
        </form> */}
        </div>
      </div >
    </>
  );
};

export default AddStatusForm;
