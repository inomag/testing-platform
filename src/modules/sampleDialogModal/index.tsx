import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Modal, { Body, Footer, Header } from 'src/@vymo/ui/blocks/modal';
import { useAppDispatch } from 'src/store/hooks';
import { removeDialog } from 'src/workspace/slice';

function SampleDialog({ header }) {
  const dispatch = useAppDispatch();
  return (
    <Modal
      onClose={() =>
        dispatch(
          removeDialog({
            id: 'SAMPLE_DIALOG',
          }),
        )
      }
    >
      <Header>
        <div>{header}</div>
      </Header>
      <Body>Test Data</Body>
      <Footer>
        <Button
          onClick={() => dispatch(removeDialog({ id: 'SAMPLE_DIALOG' }))}
          type="primary"
        >
          Close
        </Button>
      </Footer>
    </Modal>
  );
}

export default SampleDialog;
