import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import styles from './index.module.scss';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  selectedPlace: google.maps.GeocoderResult | null;
}

export function PlaceAutocomplete({ onPlaceSelect, selectedPlace }: Props) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  const map = useMap();
  const [locationText, setLocationText] = useState(
    selectedPlace?.formatted_address,
  );
  useEffect(() => {
    setLocationText(selectedPlace?.formatted_address);
  }, [selectedPlace?.formatted_address]);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'formatted_address'],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (selectedPlace?.geometry?.viewport) {
      map?.fitBounds(selectedPlace.geometry?.viewport);
    }
  }, [selectedPlace, map]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();

      onPlaceSelect(place);
    });
  }, [onPlaceSelect, placeAutocomplete]);

  const onChangeLocationInput = useCallback((event) => {
    setLocationText(event?.target.value);
  }, []);

  return (
    <div className={styles.autocomplete_container}>
      <input
        ref={inputRef}
        value={locationText}
        onChange={onChangeLocationInput}
        data-test-id="location_input"
      />
    </div>
  );
}
