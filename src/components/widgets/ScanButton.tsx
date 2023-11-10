import { AiOutlineScan } from 'react-icons/ai';

const ScanButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="btn btn-sm text-slate-100 w-fit bg-blue-800 hover:bg-gradient-to-r from-blue-800 to-blue-400"
  >
    <AiOutlineScan style={{ marginRight: 5, fontSize: 25 }} />
    <h1 className="md:hidden">Scan</h1>
  </button>
);

export default ScanButton;
