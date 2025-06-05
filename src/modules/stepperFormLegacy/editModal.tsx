import React, { useEffect } from 'react';
import { setApiStatusForEdit } from 'src/models/stepperFormLegacy/slice';
import { Section } from 'src/models/stepperFormLegacy/types';
import { useAppDispatch } from 'src/store/hooks';
import UserIdentification from './section/userIdentification';

interface IProps {
  section: Section;
  value: string;
  handleIdentificationChange: (arg1) => void;
  closeEditModal: () => void;
  handleSubmit: (section: Section, arg?: any) => void;
}
function EditModal({
  section,
  value,
  handleIdentificationChange,
  closeEditModal,
  handleSubmit,
}: IProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setApiStatusForEdit({ status: '', error: '' }));
  }, [dispatch]);
  return (
    <UserIdentification
      section={section}
      handleIdentificationChange={handleIdentificationChange}
      value={value}
      closeEditModal={closeEditModal}
      handleSubmit={handleSubmit}
    />
  );
}

export default EditModal;
