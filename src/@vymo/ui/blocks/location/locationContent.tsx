import React, { useEffect, useState } from 'react';
import { Input } from 'src/@vymo/ui/atoms';
import Modal, { Body } from 'src/@vymo/ui/blocks/modal';
import {
  ControlPosition,
  Map,
  MapControl,
  Marker,
} from '@vis.gl/react-google-maps';
import { ReactComponent as LocationIcon } from 'src/assets/icons/location.svg';
import { PlaceAutocomplete } from './autocomplete';
import useGeocoding from './useGeocoding';
import useLocationValue from './useLocationValue';
import styles from './index.module.scss';

export type Props = {
  value: any;
  onChange: (selectedLocation: any, event?: any, additionalData?: any) => void;
  type?: string;
  'data-test-id'?: string;
  disabled?: boolean;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};

export default function LocationInput({
  onChange,
  value,
  type,
  'data-test-id': dataTestId,
  disabled = false,
  viewMode = false,
  ...props
}: Props) {
  const [showMapModal, setShowMapModal] = useState(false);

  const locationValue = useLocationValue({
    value,
    type,
  });
  const { geocodedValue, setDraggedPosition } = useGeocoding({
    value: locationValue,
  });

  useEffect(() => {
    if (type === 'check_in') {
      onChange(geocodedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    geocodedValue?.geometry?.location?.lat?.(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    geocodedValue?.geometry?.location?.lng?.(),
  ]);

  if (viewMode) {
    if (geocodedValue && Object.keys(geocodedValue)?.length) {
      return (
        <span className={styles.locationViewWrapper}>
          <LocationIcon />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${geocodedValue?.geometry?.location?.lat?.()},${geocodedValue?.geometry?.location?.lng?.()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {geocodedValue?.formatted_address}
          </a>
        </span>
      );
    }
    return <span>-</span>;
  }

  return (
    <>
      <Input
        iconRight={<LocationIcon />}
        value={geocodedValue?.formatted_address || ''}
        placeholder="Enter location"
        onClick={() => setShowMapModal(!showMapModal)}
        disabled={disabled}
        data-test-id={dataTestId}
        {...props}
      />
      {showMapModal && (
        <Modal
          open={showMapModal}
          classNames={styles.location_modal}
          onBackdropClick={() => setShowMapModal(false)}
          onClose={() => setShowMapModal(false)}
          showCloseButton
          data-test-id={`${dataTestId}_modal`}
        >
          <Body>
            <Map
              defaultZoom={3}
              defaultCenter={{ lat: 0, lng: 0 }}
              gestureHandling="greedy"
              disableDefaultUI
            >
              {geocodedValue?.geometry?.location && (
                <Marker
                  position={{
                    lat: geocodedValue.geometry?.location?.lat() || 0,
                    lng: geocodedValue.geometry?.location?.lng() || 0,
                  }}
                  title={geocodedValue?.formatted_address}
                  draggable
                  onDragEnd={(e) => setDraggedPosition(e.latLng)}
                />
              )}
            </Map>
            <MapControl position={ControlPosition.TOP_CENTER}>
              <PlaceAutocomplete
                onPlaceSelect={(place) => {
                  onChange(place);
                }}
                selectedPlace={geocodedValue}
              />
            </MapControl>
          </Body>
        </Modal>
      )}
    </>
  );
}
