import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createDocumentType,
  deleteDocumentType,
  getAllDocumentTypes,
} from 'services/documentTypeServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { DocType } from 'types';

const AddDocumentType = () => {
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [data, setData] = useState<DocType[]>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const queryClient = useQueryClient();
  const [newDocumentType, setNewDocumentType] = useState<string>('');

  // Handler for adding document type
  const handleAddDocumentType = async e => {
    e.preventDefault();

    if (newDocumentType.trim() === '') {
      toast.error('Document Type type must not be empty');
      return;
    }

    await createDocumentType(authTokenObj.authToken, {
      document_type_id: null,
      document_type: newDocumentType,
    });
    queryClient.invalidateQueries(['query-documentTypesAdmin']);
    toast.success('Document Type added successfully');
    setNewDocumentType('');
  };

  useQuery({
    queryKey: ['query-documentTypesAdmin'],
    queryFn: async () => {
      const documentTypeData = await getAllDocumentTypes(
        authTokenObj.authToken,
      );
      setData(documentTypeData);
    },
    enabled: !!authTokenObj.authToken,
  });

  const documentTypeDeleteMutation = useMutation(
    (id: string) => deleteDocumentType(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.info('Document Type deleted successfully');
        setSelectedDocumentType('');
        queryClient.invalidateQueries(['query-documentTypesAdmin']);
      },
      onError: () => {
        toast.error('Failed to delete DocumentType');
      },
    },
  );

  return (
    <div className="flex flex-col items-center mt-10 ">
      <div className="2xl:w-1/2 md:w-3/4 p-5 border border-slate-200 rounded-lg">
        <div className="flex flex-row items-center">
          <h3 className="font-bold text-lg">Add Document Type</h3>
        </div>
        <form>
          <input
            type="text"
            required
            placeholder="Enter Document Type"
            className="input input-sm w-full border border-slate-300 my-5"
            value={newDocumentType}
            onChange={e => setNewDocumentType(e.target.value)}
          />
          <div className="flex flex-row justify-left">
            <button
              onClick={handleAddDocumentType}
              className="btn btn-sm bg-blue-900 hover:bg-blue-900"
            >
              Submit
            </button>
          </div>
        </form>

        <br />
        {/* Select and Delete documentType */}
        {data && data.length > 0 && (
          <div>
            <div className="flex flex-row items-center">
              <h3 className="font-bold text-lg">Delete Document Type</h3>
            </div>
            <select
              value={selectedDocumentType}
              onChange={e => setSelectedDocumentType(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Document Type
              </option>
              {data.map(documentTypeObj => (
                <option
                  key={documentTypeObj.document_type_id}
                  value={documentTypeObj.document_type_id}
                >
                  {documentTypeObj.document_type}
                </option>
              ))}
            </select>
            <div className="flex flex-row justify-left">
              <button
                onClick={() => {
                  documentTypeDeleteMutation.mutate(selectedDocumentType);
                }}
                className="btn btn-sm bg-red-600 border-0 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDocumentType;
