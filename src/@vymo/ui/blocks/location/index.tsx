import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { getDecryptedEnvValue } from 'src/workspace/utils';
import LocationInput, { Props } from './locationContent';

const GOOGLE_API_KEY = getDecryptedEnvValue('GOOGLE_API_KEY');

const Location = React.memo((props: Props) => (
  <APIProvider apiKey={GOOGLE_API_KEY || ''}>
    <LocationInput {...props} />
  </APIProvider>
));

export default Location;
