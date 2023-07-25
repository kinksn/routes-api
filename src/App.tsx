import './App.css'

function App() {

  const handleClick = async() => {
    const apiUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const apiKey = import.meta.env.VITE_ROUTES_API_KEY;

    const body = {
      origin: {
        location: {
          latLng: {
            latitude: 37.419734,
            longitude: -122.0827784
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: 37.417670,
            longitude: -122.079595
          }
        }
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      departureTime: "2023-10-15T15:01:23.045123456Z",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: "en-US",
      units: "IMPERIAL"
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
      console.log(data); // Do something with the data here
    } catch (error) {
      console.error('An error occurred:', error);
    }

  };

  return (
    <>
        <button onClick={() => handleClick()}>
          route post
        </button>
    </>
  )
}

export default App
