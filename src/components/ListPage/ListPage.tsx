import { FC, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ToolbarDesign,
  TitleLevel,
} from "@ui5/webcomponents-react"; // loads ui5-button wrapped in a ui5-webcomponents-react component
import { Asset, WorkOrder } from "types";
import { AssetTypes, WorkOrderStatuses, WorkOrderTypes } from "enums";
import useAssetTypeNames from "hooks/useAssetTypeNames";
import WorkOrderBadge from "components/WorkOrderBadge";
import { getInventory, updateWorkOrderStatus } from "services/apiServices";
import { Auth } from "aws-amplify";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import QRCode from "components/qrCode";

interface ListPageProps {}

const ListPage: FC<ListPageProps> = () => {
  const assetNames = useAssetTypeNames();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const [assetId, setAssetId] = useState<Asset["id"]>(null);
  const [woId, setWoId] = useState<WorkOrder["Id"]>(null);

  // useEffect(() => {
  //   // console.log("Asset id changed ==>>", assetId);
  // }, [assetId]);

  useEffect(() => {
    // Retrieve session token from local storage
    const data = window.localStorage.getItem("sessionToken");
    setAccessToken(data);
    (async () => {
      await Auth.currentAuthenticatedUser().then((user) => {});

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

  // console.log("unfiltered assets ==>>", assets);
  const [searchParams] = useSearchParams();
  const location = searchParams.get("name");

  const filteredAssets = useMemo(
    //() => documents.filter((a) => a.location === location),
    () => assets.filter((a) => a.location === location),
    [assets]
  );

  console.log("fiteredAssets ==>>", filteredAssets);

  // console.log("Selected workOrder ==>>", workOrder);

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
                  onClick={() => navigate("/add")}
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
                  onClick={() => navigate("/add-documents")}
                >
                  Add
                </Button>
              </Toolbar>
            }
            onItemClick={(e) => setAssetId(e.detail.item.dataset.aid)}
          >
            {/* {documents
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
              ))} */}
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
            <Toolbar style={{ height: "200px" }}>
              <Avatar
                icon="video"
                size={AvatarSize.XL}
                style={{ marginLeft: "12px" }}
              >
                {asset.imageS3 && <img src={asset.imageS3} alt="" />}
              </Avatar>
              <FlexBox
                direction={FlexBoxDirection.Column}
                style={{ marginLeft: "6px" }}
              >
                <FlexBox>
                  <Label>Name:</Label>
                  <Text style={{ marginLeft: "2px" }}>{asset.name}</Text>
                </FlexBox>
                <FlexBox>
                  <Label>Type:</Label>
                  <Text style={{ marginLeft: "2px" }}>
                    {assetNames[asset.type]}
                  </Text>
                </FlexBox>
              </FlexBox>
            </Toolbar>
            <List
              header={
                <Toolbar design={ToolbarDesign.Transparent}>
                  <Title>Work Orders</Title>
                  <ToolbarSpacer />
                  <QRCode
                    url={`https://old-cell-1004.on.fleek.co/components/AssetDetails?assetId=${encodeURIComponent(
                      assetId
                    )}`}
                  />

                  <Link
                    to={`/components/AssetDetails?assetId=${encodeURIComponent(
                      assetId
                    )}`}
                  >
                    <Button className="btn mr-6 btn-sm">Asset Details</Button>
                  </Link>
                  <Button
                    className="btn mr-6 btn-sm"
                    onClick={() =>
                      navigate("/add-workorder", { state: { assetId } })
                    }
                  >
                    Add
                  </Button>
                </Toolbar>
              }
            >
              {asset.workOrders.map((wo) => (
                <StandardListItem
                  key={wo.Id}
                  description={wo.description}
                  selected={woId === wo.Id}
                  onClick={() => {
                    setWoId(wo.Id);
                    console.log("Clicked workOrder id ==>>", woId, wo.Id);
                    console.log("WorkOrder Array ==", asset.workOrders);
                  }}
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
            <Toolbar
              design={ToolbarDesign.Solid}
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <Title level={TitleLevel.H2} style={{ color: "#0a6ed1" }}>
                {workOrder.name}
              </Title>
              <WorkOrderBadge workOrder={workOrder} />
              <ToolbarSpacer />
              <Card>
                {workOrder.status === WorkOrderStatuses.Open && (
                  <Button
                    className="btn mr-6 btn-sm"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure to mark this work order as done"
                        )
                      ) {
                        await updateWorkOrderStatus(
                          accessToken, // Replace with your accessToken
                          assetId, // Replace with your inventoryId
                          workOrder.Id,
                          WorkOrderStatuses.Closed
                        );
                        toast.success("Successfully marked as Done", {
                          position: "bottom-left",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                        // You might want to refetch the work order here to ensure the UI is up-to-date
                        // setWorkOrder(updatedWorkOrder);
                      }
                    }}
                  >
                    Mark as Done
                  </Button>
                )}
              </Card>
              <ToolbarSpacer />
              <Button
                icon="decline"
                design={ButtonDesign.Transparent}
                onClick={() => setWoId(null)}
              />
            </Toolbar>
            <Card
              style={{
                margin: "1rem",
                borderRadius: "12px",
                boxShadow: "0px 4px 20px 0px rgba(0,0,0,0.15)",
              }}
            >
              {workOrder.image && (
                <img
                  src={workOrder.image}
                  alt=""
                  style={{ width: "100%", borderRadius: "12px 12px 0 0" }}
                />
              )}
              <Text style={{ padding: "1rem", lineHeight: "1.6" }}>
                <strong>Type:</strong> {workOrder.type}
              </Text>
              <Text style={{ padding: "1rem", lineHeight: "1.6" }}>
                <strong>Work Order Description:</strong> {workOrder.description}
              </Text>
            </Card>
          </>
        )
      }
    />
  );
};

export default ListPage;
