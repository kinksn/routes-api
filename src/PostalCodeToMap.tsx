import { useState } from 'react';
import GenerateAdressFromPostCode from './GenerateAdressFromPostCode';
import { GoogleMap } from './GoogleMap';

function PostalCodeToMap() {
    const [address, setAddress] = useState<string>('');
    const [postcode, setPostcode] = useState<string>('');
    const [, setLatlng] = useState<{ lat: number, lng: number } | null>(null);

    return (
        <div>
            <GenerateAdressFromPostCode 
                postcode={postcode} 
                setPostcode={setPostcode} 
                address={address} 
                setAddress={setAddress} 
            />
            {
                address &&
                    <GoogleMap
                        address={address}
                        setAddress={setAddress}
                        setLatlng={setLatlng}
                    />
            }
        </div>
    )
}

export default PostalCodeToMap;
