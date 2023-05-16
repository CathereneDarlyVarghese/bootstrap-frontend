import { FlexBox, Title } from "@ui5/webcomponents-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Location } from "types";
import { LocationTypes } from "enums";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport";

interface AddLocationsProps {}

type AddLocationsPayload = Pick<
  Location,
  "name" | "description" | "notes"
>;

const AddLocations: FC<AddLocationsProps> = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AddLocationsPayload>({
    name: "",
    description: "",
    notes: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <FlexBox alignItems="Center">
        <button className="btn mr-6 btn-sm" onClick={() => navigate("/")}>
          Back
        </button>
        <Title>Add Locations</Title>
      </FlexBox>
      
      <div className="flex flex-col items-center">
        <form
          className="w-full max-w-lg"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name
              </label>
              <input
                required
                onChange={(e) =>
                  setData((curr) => ({ ...curr, name: e.target.value }))
                }
                value={data.name}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
              />
            </div>
            {/* <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Location Type
              </label>
              <div className="relative">
                <select
                  required
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={(e) =>
                    setData((curr) => ({ ...curr, type: e.target.value }))
                  }
                  value={data.type}
                >
                  <option>Invoice</option>
                  <option>Contract</option>
                  <option>Certificates</option>
                  <option>License</option>
                  <option>Others</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Start Date
              </label>
              <DatePicker
                required
                dateFormat="dd/MM/yyyy"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                selected={data.startdate}
                onChange={(date) =>
                  setData((curr) => ({ ...curr, startdate: date.valueOf() }))
                }
                selectsStart
                startDate={data.startdate}
                endDate={data.enddate}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                End Date
              </label>
              <DatePicker
                required
                dateFormat="dd/MM/yyyy"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                selected={data.enddate}
                onChange={(date) =>
                  setData((curr) => ({ ...curr, enddate: date.valueOf() }))
                }
                selectsEnd
                startDate={data.startdate}
                endDate={data.enddate}
                minDate={data.startdate}
              />
            </div>
          </div> */}

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Description
              </label>
              <textarea
                onChange={(e) =>
                  setData((curr) => ({ ...curr, description: e.target.value }))
                }
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
          {/* <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Upload File
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setData((curr) => ({ ...curr, file: e.target.files[0] }))
                }
                className="file-input file-input-bordered file-input-sm appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div> */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Notes
              </label>
              <textarea
                onChange={(e) =>
                  setData((curr) => ({ ...curr, notes: e.target.value }))
                }
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
          <div className=" text-center">
            <button
              onClick={() => {
                console.log(data);
              }}
              className="btn"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLocations;
