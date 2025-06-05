import { useCallback, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

type UseGeocodingProps = {
  value: any;
};

function useGeocoding({ value }: UseGeocodingProps) {
  const [position, setPosition] = useState<google.maps.GeocoderResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const geocoding = useMapsLibrary('geocoding');

  const geocode = useCallback(
    async (
      geocoder: google.maps.Geocoder,
      request: google.maps.GeocoderRequest,
    ) => {
      try {
        const response = await geocoder.geocode({ ...request });
        if (response.results && response.results[0]) {
          setPosition(response.results[0]);
        } else {
          setError('Geocoding results not found.');
        }
      } catch (err: any) {
        setError(`Geocoding error: ${err.message}`);
      }
    },
    [],
  );

  useEffect(() => {
    if (!value || !geocoding) return;

    const geocoder = new google.maps.Geocoder();
    const request: google.maps.GeocoderRequest = {};

    if (value.latitude && value.longitude) {
      request.location = { lat: value.latitude, lng: value.longitude };
    } else if (
      value?.geometry?.location?.lat &&
      value?.geometry?.location?.lng
    ) {
      const { lat } = value.geometry.location;
      const { lng } = value.geometry.location;
      request.location = {
        lat: typeof lat === 'function' ? lat() : lat,
        lng: typeof lng === 'function' ? lng() : lng,
      };
    } else if (value.formatted_address) {
      request.address = value.formatted_address;
    } else if (value.address_string) {
      request.address = value.address_string;
    }

    geocode(geocoder, request);
  }, [value, geocoding, geocode]);

  const setDraggedPosition = useCallback(
    (latLng: google.maps.LatLng | null) => {
      if (!geocoding || !latLng) return;

      const geocoder = new google.maps.Geocoder();
      geocode(geocoder, { location: latLng });
    },
    [geocode, geocoding],
  );

  return { geocodedValue: position, error, setDraggedPosition };
}

export default useGeocoding;
