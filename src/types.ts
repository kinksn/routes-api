// Geocoding API
export type GeocodingResponse = {
    results: GeocodingResult[];
    status: string;
}

type GeocodingResult = {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    types: string[];
}

type AddressComponent = {
    long_name: string;
    short_name: string;
    types: string[];
}

type Geometry = {
    bounds: Viewport;
    location: Location;
    location_type: string;
    viewport: Viewport;
}

type Location = {
    lat: number;
    lng: number;
}

type Viewport = {
    northeast: Location;
    southwest: Location;
}

// zipcloud
type ZipcloudErrorResponse = {
    message: string;
    results: null;
    status: number;
}

export type ZipcloudSuccessResponse = {
    message: null;
    results: Array<{
        address1: string;
        address2: string;
        address3: string;
        kana1: string;
        kana2: string;
        kana3: string;
        prefcode: string;
        zipcode: string;
    }>;
    status: number;
}

export type ZipcloudResponse = ZipcloudErrorResponse | ZipcloudSuccessResponse;