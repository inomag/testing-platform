import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MimeTypes } from './constants';
import DocumentUploader from './index';

const meta: Meta<typeof DocumentUploader> = {
  title: 'Molecules/DocumentUploader',
  component: DocumentUploader,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};
export default meta;
type Story = StoryObj<typeof DocumentUploader>;

export const Primary: Story = (args) => <DocumentUploader {...args} />;
Primary.args = { onFileUpload: (val) => console.log(val) };

export const AccpetedMimeTypes: Story = (args) => (
  <DocumentUploader {...args} />
);
AccpetedMimeTypes.args = {
  acceptedMimeTypes: [MimeTypes.PDF, MimeTypes.JPEG, MimeTypes.JPG],
  onFileUpload: (val) => console.log(val),
};

export const ImageEditTool: Story = (args) => <DocumentUploader {...args} />;
ImageEditTool.args = {
  editTool: true,
  multiple: true,
  onFileUpload: (val) => console.log(val),
};
