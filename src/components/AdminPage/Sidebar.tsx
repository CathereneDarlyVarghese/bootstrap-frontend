import React from "react";

interface SidebarProps {
  setToggleContent: (value: number) => void;
  setQrOptions: (value: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  setToggleContent,
  setQrOptions,
}) => (
  <div className="bg-gray-200 h-screen p-5">
    <div className="flex flex-col gap-5 items-start">
      {/* <button
          className="font-sans text-black font-semibold"
          onClick={() => {
            setToggleContent(0);
            setQrOptions(0);
          }}
        >
          Show Forms
        </button> */}
      <button
        className="font-sans text-black font-semibold"
        onClick={() => {
          setToggleContent(1);
          setQrOptions(0);
        }}
      >
        Add Asset Type
      </button>
      <button
        className="font-sans text-black font-semibold"
        onClick={() => {
          setToggleContent(2);
          setQrOptions(0);
        }}
      >
        Add Document Type
      </button>
      <button
        className="font-sans text-black font-semibold"
        onClick={() => {
          setToggleContent(3);
          setQrOptions(0);
        }}
      >
        Locations
      </button>
      <button
        className="font-sans text-black font-semibold"
        onClick={() => {
          setToggleContent(4);
          setQrOptions(0);
        }}
      >
        Section
      </button>
      <button
        className="font-sans text-black font-semibold"
        onClick={() => {
          setToggleContent(5);
          setQrOptions(0);
        }}
      >
        Placements
      </button>
    </div>
  </div>
);

export default Sidebar;
