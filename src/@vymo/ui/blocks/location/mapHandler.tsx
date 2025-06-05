import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface Props {
  place: google.maps.places.PlaceResult | null;
}

function MapHandler({ place }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
  }, [map, place]);

  return null;
}

export default React.memo(MapHandler);
