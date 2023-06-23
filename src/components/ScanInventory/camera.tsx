import React, { useEffect, useState, useRef } from "react";

const Camera = ({ onCameraLoaded, onCameraError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let mediaStream = null;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = mediaStream;
        onCameraLoaded();
      } catch (error) {
        onCameraError(error);
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onCameraLoaded, onCameraError]);

  return <video ref={videoRef} autoPlay muted playsInline />;
};

export default Camera;
