import PropTypes from "prop-types"

const DisplayDocument = (props) => {
  return (
    <>
      {/* <input type="checkbox" checked={true} id="my_modal_6" className="modal-toggle" /> */}
      <div className="">
        <div className="h-screen" >
          <div className="rounded-xl p-3 bg-white dark:bg-gray-800">
            <div className="p-0 mb-5 w-full sm:mx-2">
              <div className="flex flex-row">
                <h1 className="font-sans font-semibold text-blue-900 dark:text-white">
                  {String(props.fileName).substring(51)}
                </h1>
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth="1.5"
                  className="w-6 h-6 text-blue-800 dark:text-white ml-auto cursor-pointer"
                  onClick={props.closeFile}
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="h-52 w-full">
                <iframe src={props.fileName} width="100%" height="100%">
                  {String(props.fileName).substring(51)}
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

DisplayDocument.propTypes = {
  fileName: PropTypes.string,
  closeFile: PropTypes.any,
}

DisplayDocument.defaultProps = {
  fileName: "https://dube-filestorage.s3.amazonaws.com/document/"
}

export default DisplayDocument;
