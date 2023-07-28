import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });
    
    loader.load().then(() => {
      if (!mapRef.current) {
        return;
      }

      const position = { lat: -25.344, lng: 131.031 };

      const map = new google.maps.Map(mapRef.current, {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
      });

      new google.maps.Marker({
        map: map,
        position: position,
        title: "Uluru",
      });
    });
  }, []);

  return <div ref={mapRef} style={{ height: "50vh", width: "100%" }} />;
};
