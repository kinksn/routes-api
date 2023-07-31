import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type GoogleMapProps = {
  address: string;
  setAddress: (value: string) => void;
}

export const GoogleMap = ({ address, setAddress }: GoogleMapProps) => {
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
      

      geocoder.geocode( { address: address, language: 'ja'}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {

          const newLatLng = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
          
          setLatlng(newLatLng)

          const map = new google.maps.Map(mapRef.current, {
            zoom: 17,
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
            console.log(updatedLatLng);

            // languageオプションを追加
            geocoder.geocode({ 'location': updatedLatLng, 'language': 'ja' }, (results, status) => {
              if (status === 'OK') {
                if (results[0]) {
                  const updateAddress = results[0].formatted_address
                                        .split(' ')
                                        .slice(-1)[0]
                                        .replace('日本、', '');
                  setAddress(updateAddress);
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
  }, [address]);

  return (
    <>
      <div ref={mapRef} style={{ height: "50vh", width: "50vw" }} />
    </>
  );
};
