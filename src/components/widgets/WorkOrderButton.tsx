// interface ButtonProps {
//   title: string;
//   primary: boolean;
//   onClick: () => void;
// }

const WorkOrderButton = ({
  title,
  workPending,
  onClick,
  buttonColor,
  hoverColor,
  disableButton
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${buttonColor} gap-5 ${hoverColor}  capitalize`}
      type="submit"
      disabled={disableButton}
    >
      {title}
      <div className={`${workPending ? "badge badge-error" : "hidden"}`}>
        {workPending ? "pending" : ""}
      </div>
    </button>
  );
};

export default WorkOrderButton;
