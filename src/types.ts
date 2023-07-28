export interface GeocodingResponse {
    results: GeocodingResult[];
    status: string;
}

export interface GeocodingResult {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    types: string[];
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Geometry {
    bounds: Viewport;
    location: Location;
    location_type: string;
    viewport: Viewport;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: Location;
    southwest: Location;
}
  