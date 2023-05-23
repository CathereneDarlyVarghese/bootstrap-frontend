import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  AvatarSize,
  Button,
  ButtonDesign,
  Card,
  FlexibleColumnLayout,
  FCLLayout,
  FlexBox,
  FlexBoxDirection,
  StandardListItem,
  Label,
  List,
  Text,
  Title,
  Toolbar,
  ToolbarSpacer,
  ToolbarDesign
} from '@ui5/webcomponents-react'; // loads ui5-button wrapped in a ui5-webcomponents-react component
import { Asset, WorkOrder } from 'types';
import { AssetTypes, WorkOrderStatuses, WorkOrderTypes } from 'enums';
import useAssetTypeNames from 'hooks/useAssetTypeNames';
import WorkOrderBadge from 'components/WorkOrderBadge';
import { getInventory } from 'services/apiServices';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';

const documents: Asset[] = [
  {
    orgId: '1',
    id: 'A1',
    name: 'Asset 1',
    location: 'Location A',
    organization: {
      id: '1',
      name: 'Organization 1',
      members: [
        { id: '1', name: 'Member 1', orgId: 'A1', cognitoId: 'A1' },
        { id: '2', name: 'Member 2', orgId: 'A1', cognitoId: 'A1' }
      ]
    },
    audit: {
      createdAt: '2023-01-01',
      createdBy: 'Member 1'
    },
    workOrders: [
      {
        Id: '1',
        name: 'WorkOrder 1',
        image: 'https://example.com/workorder1.jpg',
        description: 'WorkOrder 1 Description',
        type: WorkOrderTypes.Appliances,
        status: WorkOrderStatuses.Closed
      }
    ],
    type: AssetTypes.Appliances,
    imageS3: 'https://example.com/image1.jpg'
  },
  {
    orgId: '1',
    id: 'A2',
    name: 'Asset 2',
    location: 'Location B',
    organization: {
      id: '1',
      name: 'Organization 1',
      members: [
        { id: '1', name: 'Member 1', orgId: 'A2', cognitoId: 'A2' },
        { id: '2', name: 'Member 2', orgId: 'A2', cognitoId: 'A2' }
      ]
    },
    audit: {
      createdAt: '2023-01-15',
      createdBy: 'Member 2'
    },
    workOrders: [],
    type: AssetTypes.Appliances,
    imageS3: 'https://example.com/image2.jpg'
  },
  {
    orgId: '2',
    id: 'A3',
    name: 'Asset 3',
    location: 'Location A',
    organization: {
      id: '2',
      name: 'Organization 2',
      members: [
        { id: '3', name: 'Member 3', orgId: 'A3', cognitoId: 'A3' },
        { id: '4', name: 'Member 4', orgId: 'A3', cognitoId: 'A3' }
      ]
    },
    audit: {
      createdAt: '2023-02-01',
      createdBy: 'Member 3'
    },
    workOrders: [
      {
        Id: '2',
        name: 'WorkOrder 2',
        image: 'https://example.com/workorder2.jpg',
        description: 'WorkOrder 2 Description',
        type: WorkOrderTypes.Appliances,
        status: WorkOrderStatuses.Open
      }
    ],
    type: AssetTypes.Appliances,
    imageS3: 'https://example.com/image3.jpg'
  },
  {
    orgId: '2',
    id: 'A4',
    name: 'Asset 4',
    location: 'Location C',
    organization: {
      id: '2',
      name: 'Organization 2',
      members: [
        { id: '3', name: 'Member 3', orgId: 'A4', cognitoId: 'A4' },
        { id: '4', name: 'Member 4', orgId: 'A4', cognitoId: 'A4' }
      ]
    },
    audit: {
      createdAt: '2023-02-15',
      createdBy: 'Member 4'
    },
    workOrders: [
      {
        Id: '3',
        name: 'WorkOrder 3',
        image: 'https://example.com/workorder3.jpg',
        description: 'WorkOrder 3 Description',
        type: WorkOrderTypes.Appliances,
        status: WorkOrderStatuses.Closed
      }
    ],
    type: AssetTypes.Appliances,
    imageS3: 'https://example.com/image4.jpg'
  },
  {
    orgId: '2',
    id: 'A5',
    name: 'Asset 5',
    location: 'Location D',
    organization: {
      id: '2',
      name: 'Organization 2',
      members: [
        { id: '3', name: 'Member 3', orgId: 'A5', cognitoId: 'A5' },
        { id: '4', name: 'Member 4', orgId: 'A5', cognitoId: 'A5' }
      ]
    },
    audit: {
      createdAt: '2023-03-01',
      createdBy: 'Member 3'
    },
    workOrders: [
      {
        Id: '4',
        name: 'WorkOrder 4',
        image: 'https://example.com/workorder4.jpg',
        description: 'WorkOrder 4 Description',
        type: WorkOrderTypes.Appliances,
        status: WorkOrderStatuses.Open
      },
      {
        Id: '5',
        name: 'WorkOrder 5',
        image: 'https://example.com/workorder5.jpg',
        description: 'WorkOrder 5 Description',
        type: WorkOrderTypes.Appliances,
        status: WorkOrderStatuses.Closed
      }
    ],
    type: AssetTypes.Appliances,
    imageS3: 'https://example.com/image5.jpg'
  }
];

const specificLocation = 'sg';

interface ListPageProps {}

const ListPage: FC<ListPageProps> = () => {
  const assetNames = useAssetTypeNames();
  const [assets, setAssets] = useState<Asset[]>([]);

  const navigate = useNavigate();

  const [assetId, setAssetId] = useState<Asset['id']>(null);
  const [woId, setWoId] = useState<WorkOrder['Id']>(null);

  useEffect(() => {
    const data = window.localStorage.getItem('sessionToken');
    console.log(data);
    (async () => {
      await Auth.currentAuthenticatedUser().then((user) => {
        console.log(user.token);
      });

      const assetsData = await getInventory(data);
      console.log(assetsData);
      setAssets(assetsData);
    })();
  }, []);

  const asset = useMemo(() => assets.find((a) => a.id === assetId), [assetId]);
  const workOrder = useMemo(
    () => asset && asset.workOrders.find((wo) => wo.Id === woId),
    [asset, woId]
  );

  const [searchParams] = useSearchParams();
  const location = searchParams.get('name');

  const filteredAssets = useMemo(
    //() => documents.filter((a) => a.location === location),
    () => assets.filter((a) => a.location === location),
    [assets]
  );

  console.log('fiteredAssets ==>>', filteredAssets);

  const layout = useMemo(() => {
    if (workOrder) return FCLLayout.ThreeColumnsEndExpanded;
    if (asset) return FCLLayout.TwoColumnsMidExpanded;
    return FCLLayout.OneColumn;
  }, [asset, workOrder]);

  return (
    <FlexibleColumnLayout
      layout={layout}
      className="h-screen"
      startColumn={
        <>
          <List
            header={
              <Toolbar design={ToolbarDesign.Transparent}>
                <Title>Assets</Title>
                <ToolbarSpacer />
                <Button
                  className="btn mr-6 btn-sm"
                  onClick={() => navigate('/add')}
                >
                  Add
                </Button>
              </Toolbar>
            }
            onItemClick={(e) => setAssetId(e.detail.item.dataset.aid)}
          >
            {filteredAssets.map((a) => (
              <StandardListItem
                key={a.id}
                description={a.type}
                data-aid={a.id}
                selected={assetId === a.id}
              >
                {a.name}
              </StandardListItem>
            ))}
          </List>
          <List
            header={
              <Toolbar design={ToolbarDesign.Transparent}>
                <Title>Documents</Title>
                <ToolbarSpacer />
                <Button
                  className="btn mr-6 btn-sm"
                  onClick={() => navigate('/add-documents')}
                >
                  Add
                </Button>
              </Toolbar>
            }
            onItemClick={(e) => setAssetId(e.detail.item.dataset.aid)}
          >
            {documents
              .filter((a) => a.location === specificLocation)
              .map((a) => (
                <StandardListItem
                  key={a.id}
                  description={a.type}
                  data-aid={a.id}
                  selected={assetId === a.id}
                >
                  {a.name}
                </StandardListItem>
              ))}
          </List>
        </>
      }
      midColumn={
        asset && (
          <>
            <Toolbar design={ToolbarDesign.Solid}>
              <Title>{asset.name}</Title>
              <ToolbarSpacer />
              <Button
                icon="decline"
                design={ButtonDesign.Transparent}
                onClick={() => setAssetId(null)}
              />
            </Toolbar>
            <Toolbar style={{ height: '200px' }}>
              <Avatar
                icon="video"
                size={AvatarSize.XL}
                style={{ marginLeft: '12px' }}
              >
                {asset.imageS3 && <img src={asset.imageS3} alt="" />}
              </Avatar>
              <FlexBox
                direction={FlexBoxDirection.Column}
                style={{ marginLeft: '6px' }}
              >
                <FlexBox>
                  <Label>Name:</Label>
                  <Text style={{ marginLeft: '2px' }}>{asset.name}</Text>
                </FlexBox>
                <FlexBox>
                  <Label>Genre:</Label>
                  <Text style={{ marginLeft: '2px' }}>
                    {assetNames[asset.type]}
                  </Text>
                </FlexBox>
              </FlexBox>
            </Toolbar>
            <List
              headerText="Work Orders"
              onItemClick={(e) => setWoId(e.detail.item.dataset.woid)}
            >
              {asset.workOrders.map((wo) => (
                <StandardListItem
                  key={wo.Id}
                  description={wo.description}
                  data-woid={wo.Id}
                  selected={woId === wo.Id}
                >
                  {wo.name}
                  <WorkOrderBadge workOrder={wo} />
                </StandardListItem>
              ))}
            </List>
          </>
        )
      }
      endColumn={
        workOrder && (
          <>
            <Toolbar design={ToolbarDesign.Solid}>
              <Title>{workOrder.name}</Title>
              <WorkOrderBadge workOrder={workOrder} />
              <ToolbarSpacer />
              <Button
                icon="decline"
                design={ButtonDesign.Transparent}
                onClick={() => setWoId(null)}
              />
            </Toolbar>
            <Card>
              <Text style={{ padding: 16 }}>{workOrder.description}</Text>
            </Card>
          </>
        )
      }
    />
  );
};

export default ListPage;
