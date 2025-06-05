/* eslint-disable */
import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { inputFields } from 'src/mock/data/inputFields/constants';
import Form from '../..';
import { FormVersion } from '../../types';

const meta: Meta<typeof Form> = {
  title: 'Components/Form/VymoFieldsConfig/Examples',
  component: Form,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;

type Story = StoryObj<typeof Form>;

export const TextField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
TextField.args = {
  config: { version: FormVersion.web, data: inputFields.text, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
TextField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple text field which is using [Input Field](/docs/atoms-input--docs)',
    },
  },
  status: { type: 'beta' },
};

export const NumberField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
NumberField.args = {
  config: { version: FormVersion.web, data: inputFields.number, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};

NumberField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple number field which is using [Input Field](/docs/atoms-input--docs) with type number',
    },
  },
  status: { type: 'beta' },
};

export const SentenceField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
SentenceField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.sentence,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
SentenceField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple sentence field which is using [Text Area Field](/docs/atoms-textarea--docs)',
    },
  },
  status: { type: 'beta' },
};

export const EmailField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
EmailField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.email,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
EmailField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple email field which is using [Input Field](/docs/atoms-input--docs) with email validation',
    },
  },
  status: { type: 'beta' },
};

export const PhoneField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
PhoneField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.phone,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
PhoneField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple phone field which is using [Input Field](/docs/atoms-input--docs) with phone field regex',
    },
  },
  status: { type: 'beta' },
};

export const MultiMediaField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
MultiMediaField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.multimedia,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
MultiMediaField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple multimedia field which is using Document Uploader ',
    },
  },
  status: { type: 'beta' },
};

export const DateField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
DateField.args = {
  config: { version: FormVersion.web, data: inputFields.date, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
DateField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple date field which is using Date Time Adapter for logic over [DateTime Input](/story/blocks-datetime--base)',
    },
  },
  status: { type: 'beta' },
};

export const MeetingField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
MeetingField.args = {
  config: { version: FormVersion.web, data: inputFields.meeting, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
MeetingField.parameters = {
  docs: {
    description: {
      story:
        'This is a simple date time range picker field which is using DateTimeRangePickerAdapter over [DateTime Input](/story/blocks-datetime--base)',
    },
  },
  status: { type: 'beta' },
};

export const TimeField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
TimeField.args = {
  config: { version: FormVersion.web, data: inputFields.time, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
TimeField.parameters = {
  docs: {
    description: {
      story:
        'This is a time range field which is using TimeAdapter over [DateTime Input](/story/blocks-datetime--base)',
    },
  },
  status: { type: 'beta' },
};

export const LocationField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
LocationField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.location,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
LocationField.parameters = {
  docs: {
    description: {
      story:
        'This is a location field which is using [Location Field](/docs/blocks-location--docs)',
    },
  },
  status: { type: 'beta' },
};

export const LabelField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
LabelField.args = {
  config: { version: FormVersion.web, data: inputFields.label, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
LabelField.parameters = {
  docs: {
    description: {
      story:
        'This is a Label field which is using [Text Field](/docs/atoms-text--docs)',
    },
  },
  status: { type: 'beta' },
};

export const LinkField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
LinkField.args = {
  config: { version: FormVersion.web, data: inputFields.link, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
LinkField.parameters = {
  docs: {
    description: {
      story: 'This is a Link field which is using [Tag](/docs/atoms-tag--docs)',
    },
  },
  status: { type: 'beta' },
};

export const MultiSelectAutoCompleteField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
MultiSelectAutoCompleteField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.multiSelectAutoComplete,
    grouping: [],
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
MultiSelectAutoCompleteField.parameters = {
  docs: {
    description: {
      story:
        'This is a Multi Select Autom Complete basically user can select multi options with search functionallity.This field is using [Select Field](/docs/atoms-select--docs)',
    },
  },
  status: { type: 'beta' },
};

export const CurrencyField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
CurrencyField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.currency,
    grouping: [],
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
CurrencyField.parameters = {
  docs: {
    description: {
      story:
        'This is a Currency Field, based on locale like (en-US) it can add grouping and decimal to the input entered.This field is using a adapter CurrenyAndDecimalAdapter(/docs/components-currencyanddecimalinput--docs) over [Input Field](/docs/atoms-input--docs) to handle all the grouping and decimal with displayModifier',
    },
  },
  status: { type: 'beta' },
};

export const DecimalField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
DecimalField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.decimal,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
DecimalField.parameters = {
  docs: {
    description: {
      story:
        'This is a Currency Field, based on locale like (en-US) it can add grouping and decimal to the input entered.This field is using a adapter CurrenyAndDecimalAdapter(/docs/components-currencyanddecimalinput--docs) over [Input Field](/docs/atoms-input--docs) to handle all the grouping and decimal with displayModifier',
    },
  },
  status: { type: 'beta' },
};

export const SifgField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
SifgField.args = {
  config: { version: FormVersion.web, data: inputFields.sifg, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
SifgField.parameters = {
  docs: {
    description: {
      story:
        'This is a SIFG Field, internal it is using [Select Field](/docs/atoms-select--docs)',
    },
  },
  status: { type: 'beta' },
};

export const OifField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
OifField.args = {
  config: { version: FormVersion.web, data: inputFields.oif, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
OifField.parameters = {
  docs: {
    description: {
      story:
        'This is a OIF Field Wrapper on a text field which is used to all extenal API on OIF button Click',
    },
  },
  status: { type: 'beta' },
};

export const OifFieldWithDropdown: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
OifFieldWithDropdown.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.oifWithDropdown,
    grouping: [],
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
OifFieldWithDropdown.parameters = {
  docs: {
    description: {
      story:
        'This is a OIF Field Wrapper on a Select field(SIFG) which is used to all the API onChange of the Select',
    },
  },
  status: { type: 'beta' },
};

export const AifField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
AifField.args = {
  config: { version: FormVersion.web, data: inputFields.aif, grouping: [] },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
AifField.parameters = {
  docs: {
    description: {
      story: 'This is a group of fields known as AIF',
    },
  },
  status: { type: 'beta' },
};

export const ReferralField: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
ReferralField.args = {
  config: {
    version: FormVersion.web,
    data: inputFields.referral,
    grouping: [],
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};
ReferralField.parameters = {
  docs: {
    description: {
      story:
        'This is a Referral Fields.It is based on a [Select Field](/docs/atoms-select--docs)',
    },
  },
  status: { type: 'beta' },
};
