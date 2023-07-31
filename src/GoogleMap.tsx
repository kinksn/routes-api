import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export const GoogleMap = (props: { address: string }) => {
  const [_, setLatlng] = useState<{lat: number, lng: number} | null>(null);

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

      const geocoder = new google.maps.Geocoder();
      

      geocoder.geocode( { address: props.address, language: 'ja'}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {

          const geocodeLatLng = (geocoder, latlng) => {
            if (results[0]) {
              console.log(results[0].formatted_address);
            } else {
              console.log('No results found');
            }
          }

          const newLatLng = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
          
          setLatlng(newLatLng)

          const map = new google.maps.Map(mapRef.current, {
            zoom: 16,
            center: newLatLng,
            mapId: "DEMO_MAP_ID",
          });

          const marker = new google.maps.Marker({
            position: newLatLng,
            map: map,
            draggable: true
          });

          // マーカーのドラッグが終了した時点の緯度経度をコンソールに出力
          marker.addListener("dragend", function (event) {
            const updatedLatLng = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            const geocoder = new google.maps.Geocoder;

            // languageオプションを追加
            geocoder.geocode({ 'location': updatedLatLng, 'language': 'ja' }, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                  console.log(results[0].formatted_address);
                } else {
                  console.log('No results found');
                }
              } else {
                console.log('Geocoder failed due to: ' + status);
              }
            });
            setLatlng(updatedLatLng);
            // geocodeLatLng(geocoder, updatedLatLng)
          });

        } else {
          console.error('Geocode was not successful for the following reason: ' + status)
        }
      })

    });
  }, [props.address]);

  return (
    <>
      <div ref={mapRef} style={{ height: "50vh", width: "100%" }} />
    </>
  );
};
