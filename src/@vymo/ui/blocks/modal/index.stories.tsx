import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import type { Meta, StoryObj } from '@storybook/react';
import Modal, { Body, Footer, Header } from './index';

const meta: Meta<typeof Modal> = {
  title: 'Blocks/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

let open = true;
const onClose = () => {
  open = false;
};

export const Default: Story = (args) => (
  <Modal {...args}>
    <Header>
      <div>Modal Header </div>
    </Header>
    <Body>
      <p>This is the modal body</p>
    </Body>
    <Footer>
      <Button type="primary">Close</Button>
    </Footer>
  </Modal>
);
Default.args = {
  open,
  onClose,
};
