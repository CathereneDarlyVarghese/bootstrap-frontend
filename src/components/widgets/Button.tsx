import React from "react";

interface ButtonProps {
  title: string;
  primary: boolean;
  onClick: () => void;
}

const DubeButton: React.FC<ButtonProps> = ({ title, primary, onClick }) => (
    <button
      onClick={onClick}
      className={`btn-sm px-5 btn ${
        primary ? "btn-primary" : "btn-primary" // 'btn-primary' : 'btn-outline btn-primary'
      } rounded-lg font-semibold text-slate-100 focus:outline-none bg-blue-800 border-none hover:bg-gradient-to-r from-blue-800 to-blue-400`}
    >
      {title}
    </button>
);

export default DubeButton;
