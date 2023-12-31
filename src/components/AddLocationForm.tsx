import { useState } from 'react';
import { AssetLocation } from 'types';
import { toast } from 'react-toastify';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAssetLocation } from '../services/locationServices';

const AddLocationForm = ({ addLocationForm, setAddLocationForm }) => {
  const [inputLocation, setInputLocation] = useState<string>('');
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const queryClient = useQueryClient();

  const locationAddMutation = useMutation({
    mutationFn: (assetLocationObj: AssetLocation) =>
      createAssetLocation(authTokenObj.authToken, assetLocationObj),
    onSettled: () => {
      toast.success('Location Added Successfully');
      queryClient.invalidateQueries(['query-locations']);
    },
    onError: () => {
      toast.error('Failed to Add Location');
    },
  });

  const handleSubmit = async event => {
    event.preventDefault();

    const assetLocationObj: AssetLocation = {
      location_id: '',
      location_name: inputLocation,
    };
    locationAddMutation.mutateAsync(assetLocationObj);

    setAddLocationForm(false);
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={addLocationForm}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box p-0 w-full sm:mx-2">
          <form method="post" onSubmit={handleSubmit}>
            {/* Modal header */}
            <div className="p-5 bg-white flex flex-row">
              <h3 className="font-sans font-bold text-lg text-blue-800">
                Add New Location
              </h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 ml-auto cursor-pointer"
                onClick={() => {
                  setAddLocationForm(false);
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
              <div>
                <label className="font-sans font-semibold text-black text-sm">
                  Location Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Location Name"
                  required
                  className="input input-bordered input-sm text-sm w-full my-3 font-sans"
                  onChange={e => setInputLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Modal action */}
            <div className=" m-0 p-5 flex justify-center gap-5">
              <div>
                <button
                  className="btn bg-blue-900 hover:bg-blue-900"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLocationForm;
