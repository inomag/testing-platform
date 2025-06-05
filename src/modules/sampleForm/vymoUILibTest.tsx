/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button } from '@vymo/ui/atoms';
// import '@vymo/ui/atoms/index.css';
// import '@vymo/ui/blocks/index.css';
// import '@vymo/ui/components/index.css';
import { Form } from '@vymo/ui/molecules';

// import '@vymo/ui/molecules/index.css';
// import { configData, grouping } from './constants';

function SampleForm({ lastPage }) {
  const [formData, setFormData] = useState({});

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {/* <Form
        id="test-form-vymoUi"
        name="testForm"
        onChange={(formFields) => {
          // @ts-ignore
          setFormData(formFields);
        }}
        config={{
          // @ts-ignore
          version: 'web',
          // @ts-ignore
          data: configData,
          grouping,
        }}
        formulaContext={{
          data: {
            session: {
              name: 'Vymo Superuser',
              attributes: {
                name: 'Session Context for FF',
                address__0rtm11oao: 'test test',
              },
              region_hierarchy: ['all'],
              language: '',
            },
          },
        }}
      />
      <Button size="small">Save</Button> */}
    </>
  );
}

export default SampleForm;
