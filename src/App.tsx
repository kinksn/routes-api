import './App.css'
import { useState } from 'react';
import ComputeRoute from './ComputeRoute';
import ComputeRouteMatrix from './ComputeRouteMatrix';

function App() {

  const [res, setRes] = useState('');
  const handleClick = async() => {
    const apiUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const apiKey = import.meta.env.VITE_ROUTES_API_KEY;

    const body = {
      origin: {
        vehicleStopover: false,
        sideOfRoad: false,
        location: {
          latLng: {
            latitude: "35.6585805",
            longitude: "139.742858"
          }
        }
      },
      destination: {
        vehicleStopover: false,
        sideOfRoad: false,
        location: {
          latLng: {
            latitude: "35.6635394",
            longitude: "139.867782"
          }
        }
      },
      travelMode: "DRIVE",
      routingPreference: "traffic_unaware",
      polylineQuality: "overview",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
        avoidIndoor: false
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRes(data);
      console.log(data); // Do something with the data here
    } catch (error) {
      console.error('An error occurred:', error);
    }

  };

  return (
    <>
        <ComputeRoute />
        <ComputeRouteMatrix />
    </>
  )
}

export default App
