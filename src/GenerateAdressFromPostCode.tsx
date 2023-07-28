import './App.css'
import { useState } from 'react';
import { GeocodingResponse } from './types';
import { GoogleMap } from './GoogleMap';

function GenerateAdressFromPostCode() {
    
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');

    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostcode(() => e.target.value)
    }

    const getAdress = (data: GeocodingResponse) => {
        console.log(data)
        const addressComponents = data.results[0].address_components;
        return `${addressComponents[3]?.long_name}${addressComponents[2]?.long_name}${addressComponents[1]?.long_name}`
    }
    
    const handleSubmit = async() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&language=ja&components=country:JP&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAddress(() => getAdress(data));
            setPostcode('');
        }   catch (error) {
            console.error('An error occurred:', error);
        }
    };
    
    return (
        <div>
            <div>
                <input value={postcode} onChange={handleOnchange} type="text" />
                <button onClick={() => postcode && handleSubmit()}>
                    get adress
                </button>
            </div>
            <div>{address}</div>
            <GoogleMap />
        </div>
    )
}

export default GenerateAdressFromPostCode
