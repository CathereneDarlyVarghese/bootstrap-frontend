import { useEffect, useRef, useState } from "react";
import WorkOrderButton from "components/widgets/WorkOrderButton";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import { Asset, AssetCheck } from "types";
import { AssetTypes } from "enums";
import { uploadFiletoS3 } from "utils";
import { addInventory } from "services/apiServices";
import { toast } from "react-toastify";
import { createAssetCheck } from "services/assetCheckServices";
import { createFile } from "services/fileServices";
import useStatusTypeNames from "hooks/useStatusTypes";

const AddStatusForm = ({
  addFormOpen,
  setAddFormOpen,
  assetId,
  onStatusAdded,
}) => {
  // Custom hook to fetch asset type names
  const assetTypeNames = useAssetTypeNames();
  const [token, setToken] = useState<string>("");
  const [reportIssue, setReportIssue] = useState(false);
  const now = new Date();
  const statusTypeNames = useStatusTypeNames();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<any>();

  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    setToken(data);
  }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);

    if (reportIssue) {
      // Case when reporting an issue
      try {
        // Upload file to S3 bucket
        const imageLocation = await uploadFiletoS3(file, "assetCheck");
        const createdFile = await createFile(token, {
          file_id: "",
          file_array: [imageLocation.location],
        });

        const assetCheck = {
          uptime_check_id: "",
          asset_id: assetId,
          status_check: selectedStatus,
          file_id: String(createdFile),
          uptime_notes: formData.get("uptime_notes") as string,
          modified_by: formData.get("name") as string,
          modified_date: new Date(),
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
        modified_by: formData.get("name") as string,
        modified_date: new Date(),
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
      <div className="modal">
        <div className="modal-box p-0 w-full sm:mx-2">
          <form method="post" onSubmit={handleSubmit} ref={formRef}>
            {/* Modal header */}
            <div className="p-5 bg-white flex flex-row">
              <h3 className="font-sans font-bold text-lg text-blue-800">
                Status Check {now.toLocaleDateString()}
              </h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 ml-auto cursor-pointer"
                onClick={() => {
                  setAddFormOpen(false);
                  setReportIssue(false);
                }}
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="flex flex-col p-5">
              {/* Input field for asset name */}
              <div>
                <label className="font-sans font-semibold text-black text-sm">
                  Who is This?
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  required
                  className="input input-bordered input-sm text-sm w-full my-3 font-sans"
                />
              </div>
              {reportIssue && (
                <div>
                  <div>
                    <label className="font-sans font-semibold text-sm text-black ">
                      Notes
                    </label>
                    <input
                      type="text"
                      name="uptime_notes"
                      placeholder="Enter Notes"
                      className="input input-bordered input-sm text-sm w-full my-3 font-sans "
                    />
                  </div>

                  <div>
                    <label className="font-sans font-semibold text-sm text-black">
                      Asset Status
                    </label>
                    <select
                      required
                      name="status"
                      className="select select-sm my-3 border border-slate-300 2xl:w-full md:w-fit"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="" disabled hidden>
                        Select Asset Status
                      </option>
                      {Object.entries(statusTypeNames).map(
                        ([statusId, statusName]) => (
                          <option key={statusId} value={statusId}>
                            {statusName}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="file_input"
                      className="font-sans font-semibold text-sm text-black "
                    >
                      Add Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="block w-full text-md text-white border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3 "
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal action */}
            <div className=" m-0 p-5 flex justify-center gap-5">
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
                  onClick={handleSubmit}
                >
                  Fine
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStatusForm;
