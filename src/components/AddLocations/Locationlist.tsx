import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-daisyui";

import "./locationstyle.css";

interface Location {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "Location A",
    description: "Location A",
    imageUrl: "https://picsum.photos/200/300?random=1",
  },
  {
    id: 2,
    name: "Location B",
    description: "Location B",
    imageUrl: "https://picsum.photos/200/300?random=2",
  },
  {
    id: 3,
    name: "Location C",
    description: "Location C",
    imageUrl: "https://picsum.photos/200/300?random=3",
  },
  {
    id: 4,
    name: "Location D",
    description: "Location D",
    imageUrl: "https://picsum.photos/200/300?random=4",
  },
];

const Home = () => {
  return (
    <>
      <div data-theme="cupcake">
        <div className="heading-container">
          <h1 className="main-heading">Select your location to get started</h1>
        </div>
        <div
          className="container mx-auto mt-10"
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            style={{ alignItems: "center", alignContent: "center" }}
          >
            {locations.map((location) => (
              <div
                style={{
                  marginTop: "5rem",
                  width: "16rem",
                  height: "11rem",
                  marginBottom: "10rem",
                  boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
                }}
                className="card bg-primary w-96  shadow-xl"
              >
                <Link
                  key={location.id}
                  to={`/location?name=${encodeURIComponent(location.name)}`}
                >
                  <div
                    style={{
                      width: "85%",
                      position: "absolute",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      borderRadius: 20,
                      overflow: "hidden",
                      height: "100%",
                    }}
                  >
                    <figure
                      style={{
                        height: "100%",
                        objectFit: "fill",
                        marginTop: "-2rem",
                      }}
                    >
                      <img
                        src={location.imageUrl}
                        alt={location.name}
                        style={{ display: "block" }}
                      />
                    </figure>
                  </div>

                  <div
                    className="card-body text-neutral"
                    style={{ marginTop: "3rem", alignItems: "center" }}
                  >
                    <h2 className="card-title ">{location.name}</h2>
                    <p>{location.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div data-theme="cupcake">
        <div className="container mx-auto mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {locations.map((location) => (
              <Link
                key={location.id}
                to={`/location?name=${encodeURIComponent(location.name)}`} // Pass location.name as a query parameter
              >
                <Card>
                  <img
                    className="h-48 w-full object-cover"
                    src={location.imageUrl}
                    alt={location.name}
                  />

                  <h2 className="text-lg font-medium">{location.name}</h2>
                  <p className="text-gray-600">{location.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Home;
