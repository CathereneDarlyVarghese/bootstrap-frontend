import React from "react";
import image from "./image.jpg";
import image2 from "./image2.jpg";

const CardRight = () => {
  return (
    <div className="card w-full  my-5 p-5 bg-primary-content">
      <figure className="rounded-none">
        <img src={image} alt="an image" className="rounded-xl h-48 w-full" />
      </figure>
      <div
        className="card-body px-0"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <h2 className="card-title w-2/3" style={{ color: "#232F3F" }}>
          Test Appliance two
        </h2>
        <button
<<<<<<< HEAD
          className="btn btn-xs bg-blue-800 border-none hover:bg-gradient-to-r from-blue-600 to-blue-400"
=======
          className="btn btn-xs btn-primary"
>>>>>>> d3ffcadd9dcc82071c5b694fe3d881761595c0ed
          style={{ marginLeft: "auto" }}
        >
          Appliances
        </button>
      </div>
      <div className="card-actions">
        <h3 className="text-black">Description:</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
          imperdiet etiam. Sed pellentesque convallis diam sodales odio eget nec
          nibh dolor.
          <p>
            Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus
            imperdiet etiam. Sed pellentesque convallis diam sodales odio eget
            nec nibh dolor. At sit commodo proin pretium senectus sed ipsum id.
            dolor sit amet consectetur..
          </p>
        </p>
      </div>
    </div>
  );
};

export default CardRight;
