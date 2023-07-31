import './App.css'

function ComputeRouteMatrix() {

  const handleClick = async() => {
    const apiUrl = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const body = {
      origins: [
        {
          waypoint: {
            location: {
              latLng: {
                latitude: 37.420761,
                longitude: -122.081356
              }
            }
          }
        },
        {
          waypoint: {
            location: {
              latLng: {
                latitude: 37.403184,
                longitude: -122.097371
              }
            }
          }
        }
      ],
      destinations: [
        {
          waypoint: {
            location: {
              latLng: {
                latitude: 37.420999,
                longitude: -122.086894
              }
            }
          }
        },
        {
          waypoint: {
            location: {
              latLng: {
                latitude: 37.383047,
                longitude: -122.044651
              }
            }
          }
        }
      ],
      travelMode: "DRIVE",
      routingPreference: "traffic_unaware"
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred:', error);
    }

  };

  return (
    <>
        <button onClick={() => handleClick()}>
          compute route matrix post
        </button>
    </>
  )
}

export default ComputeRouteMatrix
