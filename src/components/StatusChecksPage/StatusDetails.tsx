import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { TfiClose } from 'react-icons/tfi';
import { deleteAssetCheck } from 'services/assetCheckServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IncomingAssetCheck } from 'types';
import closeIcon from '../../icons/closeIcon.svg';

interface StatusDetailsProps {
  selectedAssetCheck: IncomingAssetCheck | undefined;
  closeAsset: () => void;
  status_check_data: JSON;
}

const StatusDetails: React.FC<StatusDetailsProps> = ({
  selectedAssetCheck,
  closeAsset,
  status_check_data,
}) => {
  // Hook to get the authentication token
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');

  // React Query's client
  const queryClient = useQueryClient();

  function camelCaseToNormal(text) {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  const assetCheckMutation = useMutation({
    mutationFn: () =>
      deleteAssetCheck(
        authTokenObj.authToken,
        selectedAssetCheck?.uptime_check_id,
      ),
    onSettled: () => {
      toast.info("Asset's Status Check Deleted Successfully");
      queryClient.invalidateQueries(['query-assetChecks']);
    },
    onError: () => {
      toast.error("Failed to Delete Asset's Status Check");
    },
  });

  return (
    <div className="h-5/6 mx-4 mt-2 p-5 bg-white dark:bg-gray-800 rounded-xl overflow-y-auto flex flex-col border border-gray-200 dark:border-gray-600 hover:border-blue-800 hover:dark:border-gray-400">
      <div className="flex 2xl:flex-row lg:flex-col gap-5 mb-3">
        <div className="flex flex-col">
          <button className="ml-auto 2xl:hidden lg:block" onClick={closeAsset}>
            <img src={closeIcon} alt="Close" />
          </button>
          <h1 className="font-sans font-bold text-xl text-black dark:text-white lg:text-lg capitalize my-auto mx-auto">
            Status Check Date:{' '}
            {selectedAssetCheck?.modified_date.substring(0, 10)}
          </h1>
        </div>
        <button className="ml-auto 2xl:block lg:hidden" onClick={closeAsset}>
          <TfiClose className="text-black dark:text-white" />
        </button>
      </div>
      <figure className="rounded-none">
        {selectedAssetCheck?.images_array &&
          selectedAssetCheck?.images_array[0] && (
            <img
              src={selectedAssetCheck?.images_array[0][0]}
              alt="Images of the status checks"
              className="rounded-xl h-32 w-fit object-cover mx-auto"
            />
          )}
      </figure>
      <div className="px-0 overflow-auto flex flex-col h-fit mt-4">
        <div className="flex 2xl:flex-row lg:flex-col">
          <h2
            className="flex text-black dark:text-white text-xl font-semibold font-sans tracking-wide xl:text-sm"
            style={{ wordSpacing: 3 }}
          >
            {selectedAssetCheck?.status_check}
          </h2>
          <div className="my-2 2xl:ml-auto lg:ml-0 lg:mx-auto flex flex-row items-center">
            {/* <Link to={`/qr-code/${assetId}`}>
              <BsQrCode className="text-blue-500 text-xl" />
            </Link>
            <Link to={`/work-orders/${assetId}`}>
              <AiOutlineCalendar className="text-blue-500 text-xl mx-2" />
            </Link>
            <Link to={`/edit-asset/${assetId}`}>
              <FiEdit3 className="text-blue-500 text-xl" />
            </Link> */}

            <AiOutlineDelete
              className="text-red-500 text-xl ml-2 cursor-pointer"
              onClick={() => {
                if (
                  // eslint-disable-next-line
                  window.confirm(
                    'Are you sure you want to delete this status check',
                  )
                ) {
                  assetCheckMutation.mutate();
                  closeAsset();
                }
              }}
            />
          </div>
        </div>
        <div>
          <table>
            <tbody>
              <tr className="text-blue-900 dark:text-blue-500 font-semibold font-sans my-1 text-sm">
                <td className="w-24">Modified By</td>
                <td className="w-5">:</td>
                <td>
                  {selectedAssetCheck?.modified_by
                    ? selectedAssetCheck?.modified_by
                    : 'Data Not Available'}
                </td>
              </tr>
              {status_check_data &&
                Object.entries(status_check_data).map(([key, value], index) => (
                  // <div
                  //   key={index}
                  // >
                  //   <div className="flex flex-row ">
                  //     <p className="text-blue-900 dark:text-blue-500 font-semibold
                  // font-sans my-1 text-sm">
                  //       {key} :
                  //     </p>
                  //     <p className="text-blue-900 dark:text-blue-500 font-semibold
                  // font-sans my-1 text-sm">
                  //       {value}
                  //     </p>
                  //   </div>

                  // </div>
                  <tr
                    key={index}
                    className="text-blue-900 dark:text-blue-500 font-semibold font-sans my-1 text-sm"
                  >
                    <td>{camelCaseToNormal(key)}</td>
                    <td>:</td>
                    <td>{value || 'Data not available'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusDetails;
