import {
  Button,
  Title,
  Label,
  Form,
  FormItem,
  Input,
  FlexBox,
  RadioButton,
  Toolbar,
  ToolbarSpacer
} from '@ui5/webcomponents-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Asset } from 'types';
import { AssetTypes } from 'enums';
import useAssetTypeNames from 'hooks/useAssetTypeNames';
import '@ui5/webcomponents/dist/features/InputElementsFormSupport';
import { uploadFiletoS3 } from 'utils';
import { addInventory } from 'services/apiServices';
// import { S3 } from 'react-s3';

interface AddInventoryProps {}

const AddInventory: FC<AddInventoryProps> = () => {
  const navigate = useNavigate();
  const assetTypeNames = useAssetTypeNames();
  const [token, settoken] = useState<string>('');
  const [file, setFile] = useState<any>();
  const [data, setData] = useState<Asset>({
    organization: {
      name: 'testorg1',
      id: '2',
      members: []
    },
    orgId: '2',
    audit: {
      createdAt: 'test',
      createdBy: 'test'
    },
    id: '2',
    name: '',
    imageS3: '',
    location: 'sg',
    workOrders: [],
    type: AssetTypes.Appliances
  });
  const handleSubmit = async () => {
    console.log(data);
    try {
      const imageLocation = await uploadFiletoS3(file, 'inventory');
      console.log(imageLocation);
      data.imageS3 = imageLocation.location;
      await addInventory(token, data);
    } catch (error) {
      alert('something went wrong!');
    }
  };

  useEffect(() => {
    const data = window.localStorage.getItem('sessionToken');
    settoken(data);
  }, []);

  return (
    <>
      <FlexBox alignItems="Center">
        <Button className="btn mr-6 btn-sm" onClick={() => navigate('/')}>
          Back
        </Button>
        <Title>Add Inventory</Title>
      </FlexBox>

      <div className="flex flex-col items-center">
        <form
          className="w-full max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
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

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Location
              </label>
              <div className="relative">
                <select
                  required
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={(e) => {
                    setData((curr) => ({ ...curr, location: e.target.value }));
                  }}
                  value={data.location}
                >
                  <option value="sg">Singapore</option>
                  <option>Location B</option>
                  <option>Location C</option>
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
            </div>
            {/* <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <FormItem
                label={
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Location
                  </label>
                }
              >
                <input
                  required
                  onChange={(e) =>
                    setData((curr) => ({ ...curr, location: e.target.value }))
                  }
                  value={data.location}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="Text"
                />
              </FormItem>
            </div> */}
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Photo
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input file-input-bordered file-input-sm appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <FormItem
                label={
                  <Label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Asset Type
                  </Label>
                }
              >
                {[AssetTypes.Appliances].map((type) => (
                  <RadioButton
                    key={type}
                    name="type"
                    text={assetTypeNames[type]}
                    value={AssetTypes.Appliances}
                    checked={type === data.type}
                    onChange={() => setData((curr) => ({ ...curr, type }))}
                  />
                ))}
              </FormItem>
            </div>
          </div>
          <div className=" text-center">
            <button
              onClick={() => {
                console.log(data);
              }}
              className="btn"
            >
              Submit Inventory
            </button>
          </div>
        </form>
      </div>

      {/* 

      <Form style={{ alignItems: "center" }} onSubmit={console.log}>
        <FormItem label="Name">
          <Input
            value={data.name}
            onChange={(e) =>
              setData((curr) => ({ ...curr, name: e.target.value }))
            }
          />
        </FormItem>
        <FormItem label="Photo">
          <Input
            value={data.imageS3}
            onChange={(e) =>
              setData((curr) => ({ ...curr, imageS3: e.target.value }))
            }
          />
        </FormItem>
        <FormItem label={<Label>Location</Label>}>
          <Input
            value={data.location}
            onChange={(e) =>
              setData((curr) => ({ ...curr, location: e.target.value }))
            }
          />
        </FormItem>
        <FormItem label={<Label>Asset Type</Label>}>
          <FlexBox alignItems="Center">
            {[AssetTypes.Appliances].map((type) => (
              <RadioButton
                key={type}
                name="type"
                text={assetTypeNames[type]}
                value={AssetTypes.Appliances}
                checked={type === data.type}
                onChange={() => setData((curr) => ({ ...curr, type }))}
              />
            ))}
          </FlexBox>
        </FormItem>
      </Form>

      <Toolbar>
        <ToolbarSpacer />
        <Button onClick={() => console.log(data)}>Submit Inventory</Button>
      </Toolbar> */}
    </>
  );
};

export default AddInventory;
