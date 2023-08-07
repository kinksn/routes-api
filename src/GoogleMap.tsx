import { useEffect, useRef, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader"; 

type GoogleMapProps = {
  address: string;
  setAddress: (value: string) => void;
  setLatlng: (value: { lat: number, lng: number } | null) => void;
};

export const GoogleMap = ({ address, setAddress, setLatlng }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  const geocodeAddress = useCallback((address: string, geocoder: google.maps.Geocoder, resultsCallback: (result: google.maps.GeocoderResult) => void) => {
    geocoder.geocode({ 'address': address, componentRestrictions: { country: 'JP' } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results !== null) {
        resultsCallback(results[0]);
      } else {
        console.error('Geocode was not successful: ' + status);
      }
    });
  }, []);

  const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    const geocoder = new google.maps.Geocoder();
    const updatedLatLng = {
      lat: event.latLng?.lat() || 0,
      lng: event.latLng?.lng() || 0,
    };

    geocoder.geocode({ 'location': updatedLatLng, 'language': 'ja' }, (results, status) => {
      if (status !== 'OK' || !results) {
        console.log(`Geocoder failed: ${status}`);
        return;
      }

      if (!results[0]) {
        console.log('No results found');
        return;
      }

      const updateAddress =
        results[0].formatted_address
        .replace('日本、', '')
        .split(' ')[1];
      
      setAddress(updateAddress);
      setLatlng(updatedLatLng);
    });
  }, [setAddress, setLatlng]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });
    
    loader.importLibrary('maps').then(() => {
      const geocoder = new google.maps.Geocoder();
      geocodeAddress(address, geocoder, (result) => {
        const newLatLng = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        };
        if(mapRef.current) { 
          mapInstance.current = new google.maps.Map(mapRef.current, {
            zoom: 17,
            center: newLatLng,
            mapId: "DEMO_MAP_ID",
          });
          markerInstance.current = new google.maps.Marker({
            position: newLatLng,
            map: mapInstance.current,
            draggable: true
          });
          markerInstance.current.addListener("dragend", handleMarkerDragEnd);
        }
      });
    });
  }, [address, geocodeAddress, handleMarkerDragEnd]);

  return (
    <div ref={mapRef} style={{ height: "50vh", width: "50vw" }} />
  );
};
