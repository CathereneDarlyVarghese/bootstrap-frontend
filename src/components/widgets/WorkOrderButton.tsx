type WorkOrderButtonProps = {
  title: string;
  workPending: boolean;
  onClick?: () => void; // Making onClick optional
  buttonColor: string;
  hoverColor: string;
  disableButton: boolean;
};

const WorkOrderButton: React.FC<WorkOrderButtonProps> = ({
  title,
  workPending,
  onClick,
  buttonColor,
  hoverColor,
  disableButton,
}) => (
  <button
    onClick={onClick}
    className={`btn ${buttonColor} gap-5 ${hoverColor}  capitalize`}
    type="submit"
    disabled={disableButton}
  >
    {title}
    <div className={`${workPending ? 'badge badge-error' : 'hidden'}`}>
      {workPending ? 'pending' : ''}
    </div>
  </button>
);

export default WorkOrderButton;
