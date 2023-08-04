import './App.css'
import { useState } from 'react';
import { GeocodingResponse, ZipcloudResponse, ZipcloudSuccessResponse } from './types';

type AddressResult = ZipcloudSuccessResponse['results'][0];

type GenerateAdressFromPostCodeProps = {
    postcode: string;
    setPostcode: (value: string) => void;
    address: string;
    setAddress: (value: string) => void;
  }

function GenerateAdressFromPostCode({ postcode, setPostcode, address, setAddress }: GenerateAdressFromPostCodeProps)  {
    const [selectedAddress, setSelectedAddress] = useState<AddressResult[] | null>(null);

    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostcode(e.target.value)
    }

    const setAdressFromZipcloud = async(postcode: string): Promise<void> => {
        const apiUrl = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postcode}`;

        try {
            const rawResponse = await fetch(apiUrl);

            if(!rawResponse.ok) {
                throw new Error(`HTTP error! status: ${rawResponse.status}`);
            }

            const response: ZipcloudResponse = await rawResponse.json();

            if (response.status === 200 && response.results !== null) {
                // console.log(response.results);
                setSelectedAddress(response.results);
            } else {
                console.log(response.message);
            }
        } catch(error) {
            console.error(error);
        }
    }

    const selectAddressList = (selectedAddress: AddressResult[] | null) => {
        if (selectedAddress === null) {
            return;
        }
        return selectedAddress.map( (item, index) => {
            const address = item.address1 + item.address2 + item.address3
            return <li key={index} onClick={() => handleSelectedAddress(address)}>{address}</li>
        })
    };

    const handleSelectedAddress = (address: string) => {
        setAddress(address);
        setSelectedAddress(null);
    }

    const getAdress = (data: GeocodingResponse) => {
        const addressComponents = data.results[0].address_components;
        const filterdAddressComponents = addressComponents.filter(item => {
            if (item.types[0] !== 'postal_code' && item.types[0] !== 'country') {
                return item.long_name;
            }
        });
        const address = filterdAddressComponents.reverse().map(item => item.long_name).join("");

        return address;
    }

    const isValidPostcode = (input: string) => {
        const regex = /^(\d{3}-\d{4}|\d{7})$/;
        return regex.test(input)
    }
    
    const handleSubmit = async() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&language=ja&components=country:JP&key=${apiKey}`;

        if (!isValidPostcode(postcode)) {
            alert('無効な郵便番号です');
            return;
        }

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const results = data.results[0];

            const isMultipleAddress = results.formatted_address === '日本';

            if (isMultipleAddress) {
                console.log('request zipcloud api')
                setAdressFromZipcloud(postcode)
                return;
            }

            console.log('request Geocoding api');
            if(selectedAddress) { setSelectedAddress(null); }
            setAddress(getAdress(data));

        }   catch (error) {
            console.error('An error occurred:', error);
        }
    };
    
    return (
        <div>
            <div>
                <div>
                    <input value={postcode} onChange={handleOnchange} type="text" />
                    <ul>{selectAddressList(selectedAddress)}</ul>
                </div>
                <button onClick={() => postcode && handleSubmit()}>
                    住所をゲッツ
                </button>
            </div>
            
            <div>{address}</div>
        </div>
    )
}

export default GenerateAdressFromPostCode;
