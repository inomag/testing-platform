import { useEffect, useState } from 'react';

function useLocationValue({ value, type }) {
  const [locationValue, setLocationValue] = useState<any>(value);

  useEffect(() => {
    if (type === 'check_in') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationValue({ latitude, longitude });
        },
        (error) => {
          // TODO: Pratik fix this
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw error;
        },
      );
    } else {
      setLocationValue(value);
    }
  }, [value, type]);

  return locationValue;
}

export default useLocationValue;
