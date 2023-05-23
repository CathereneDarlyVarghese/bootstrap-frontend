import React from "react";
import PropTypes from 'prop-types';

import image from "./Images/image.jpg";
import image2 from "./Images/image2.jpg";
import image3 from "./Images/image3.jpeg";
import image6 from "./Images/image6.jpeg";

const CardLeft = (/*props*/) => {
  return (
    <div className="card card-side border border-blue-900 w-auto my-2 mx-2 p-5 bg-slate-100 max-h-40 overflow-y-auto" id="style-7">
      <figure>
        <img src={image6} alt="an image" className="rounded-xl h-32" />
      </figure>
      <div className="card-body py-0 overflow-hidden">
        <button className="btn btn-xs btn-primary w-20 bg-blue-900 border-white hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none">Appliances</button>
        <h1 className="text-blue-900 text-lg font-bold">Test Appliance</h1>
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="red"
            className="w-16 h-16"
            style={{ marginTop: -20 }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <p className="text-sm truncate text-blue-600">
            4517 Washington Ave. Manchester, Kentucky 39495
          </p>
        </div>
      </div>
    </div>
  )
};

// CardLeft.propTypes = {
//   imageLocation: PropTypes.string,
//   title: PropTypes.string,
//   address: PropTypes.string
// };

// CardLeft.defaultProps = {
//   imageLocation: require("./Images/image6.jpeg"),
//   title: "Test Appliance",
//   address: "4517 Washington Ave. Manchester, Kentucky 39495"
// }

export default CardLeft;
