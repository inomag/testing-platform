/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable */
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Tag } from 'src/@vymo/ui/atoms';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import TabLayout from 'src/@vymo/ui/blocks/tabs';
import Form from 'src/@vymo/ui/molecules/form';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import { initLmsConfig } from 'src/models/auth/lmsLogin/thunk';
import { useAppDispatch } from 'src/store/hooks';
import { renderDialog } from 'src/workspace/slice';
import {
  tableCols as columnConfigs,
  tableData as data,
  tableRes,
} from './constants';

function SampleForm(props) {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('Test Error');

  const formRef = useRef(null);

  const dispatch = useAppDispatch();

  const onClickFormSave = useCallback(async () => {
    const { data: inputs, valid } =
      // @ts-ignore
      await formRef?.current?.getFieldsForSubmission?.();
    console.log(inputs, valid);
  }, []);

  const onDialogOpen = () => {
    dispatch(
      renderDialog({ id: 'SAMPLE_DIALOG', props: { header: 'Sample' } }),
    );
  };

  useEffect(() => {
    dispatch(initLmsConfig());
  }, []);

  const fetchData = async (start, fetchSize, sorting) => {
    // Simulate data slicing for pagination
    const dataSlice = data.slice(start, start + fetchSize);

    // Return in the expected format with data and metadata for row count
    return {
      data: dataSlice,
      meta: {
        totalRowCount: data.length, // total rows in the "database"
      },
    };
  };

  const args = {
    tableData: data,
    columnConfigs,
    tableConfig: {
      showSearch: true,
      name: 'Test Table',
      isRowSelectionEnabled: true,
      fetchSize: 5,
      visualizedRows: false,
      pagination: { visible: false, pageSize: data.length, currentPage: 1 },
      filters: [
        {
          column: 'First Name',
          type: 'text',
        },
        {
          column: 'Status',
          type: 'select',
        },
      ],
    },
  };

  return (
    <>
      {/* <ChildComponent id={USER_PROFILE} /> */}
      {/* <Table {...args} /> */}
      <TabLayout
        items={[
          {
            key: '1',
            label: 'Tab 1',
            children: <div>Tab 1 Content</div>,
          },
          {
            key: '2',
            label: 'Tab 2',
            children: <div>Tab 2 Content</div>,
          },
        ]}
        defaultKey="1"
        onChange={(key) => console.log(key)}
      />

      <SkeletonLoader avtar lines={4} />

      <SkeletonLoader lines={4} />
      <SkeletonLoader rect />
      <Tag bold variant="success">
        SUCCESS
      </Tag>
      {/* <Form
        // @ts-ignore
        ref={formRef}
        id="testForm"
        name="testForm"
        onChange={(formFields) => {
          setFormData(formFields);
          console.log(formFields);
        }}
        config={{
          version: FormVersion.web,
          // @ts-ignore
          data: configData,
          grouping,
          fieldItemConfig: {
            showDisabledIcon: true,
          },
          beforeSaveHookConfig: {
            multimedia: {
              isMultimediaBeforeSaveHookDisabled: false,
              valueFormat: 'url',
            },
          },
        }}
        value={{
          sifg_payment_mode_chw0gfq6vo: { value: 'Cheque' },
          cheque_dd_no_ce29164mpp: { value: 'testing' },
          doc_poa_pan: {
            value: [
              'https://images.meesho.com/images/products/249849892/o21p9_512.webp',
            ],
          },
          doc_poi_passport: {
            value:
              '{"media_type":"image/jpeg","items":[{"bucket":"vymo-uploads-staging","filename":"561fface-2c16-4889-88aa-82f16d448f21-k2BOHLwNQw.png","size":57868,"mime":"image/png","label":"2024-10-21-10-45-38-0.png","path":"lms/abcapital/A6K7-jwEfw/561fface-2c16-4889-88aa-82f16d448f21-k2BOHLwNQw.png"}],"bucket":"vymo-uploads-staging"}',
          },
          doc_poi_passport2: {
            value: [
              'https://upload.wikimedia.org/wikipedia/commons/3/31/A_sample_of_Permanent_Account_Number_%28PAN%29_Card.jpg',
            ],
          },
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
            vo: {
              inputs_map: {
                test: 'JLCUS8892l',
                bank_verified: 'Yes',
              },
            },
          },
        }}
      /> */}

      <Button onClick={onClickFormSave}>Save</Button>
      <Button onClick={onDialogOpen}>open Dialog</Button>
    </>
  );
}

export default SampleForm;
