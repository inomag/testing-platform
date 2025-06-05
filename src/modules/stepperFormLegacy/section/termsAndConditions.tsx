import React, { useCallback, useEffect, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Modal, { Body, Footer, Header } from 'src/@vymo/ui/blocks/modal';
import classNames from 'classnames';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getCurrentStep } from 'src/models/stepperFormLegacy/selectors';
import {
  ActionType,
  Input,
  SectionMeta,
} from 'src/models/stepperFormLegacy/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { getObjectUrl } from 'src/modules/recruitment/queries';
// eslint-disable-next-line vymo-ui/restrict-import
import { actionAPI } from 'src/modules/recruitment/thunk';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import PreviewLink from './previewLink';
import styles from '../index.module.scss';

interface IProps {
  title: string;
  code: string;
  inputObj: Input;
  action: Pick<SectionMeta, 'action'>['action'];
}
export default function TermsAndConditions({
  title,
  code,
  inputObj,
  action,
}: IProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [link, setLink] = useState('');
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(getCurrentStep);
  const fileName = action?.link?.split('/')?.pop() || '';

  const onClose = () => {
    setLink('');
    setIsModalVisible(false);
  };
  const onAgree = useCallback(() => {
    let updatedInputs: Input[] = [];
    setIsModalVisible(false);
    setLink('');
    if (inputObj) {
      updatedInputs = [{ ...inputObj, value: 'true' }];
    }
    const payload = {
      actionType: 'submit' as ActionType,
      payload: {
        current_step: currentStep,
        current_section: code,
        inputs: updatedInputs,
      },
    };
    dispatch(actionAPI(payload));
  }, [code, currentStep, dispatch, inputObj]);
  const handleClick = useCallback(async () => {
    if (action?.link) {
      const objectLink = await getObjectUrl(action?.link);
      setLink(objectLink);
    }
  }, [action?.link]);
  useEffect(() => {
    if (link) {
      setIsModalVisible(true);
    }
  }, [link]);
  return (
    <div className={classNames(styles['stepper-sections__info-section'])}>
      {action?.link && (
        <Button
          onClick={handleClick}
          data-test-id={`${code}-terms-and-conditions`}
        >
          {action?.label}
        </Button>
      )}
      <Modal
        open={isModalVisible}
        onClose={onClose}
        closeOnEscape
        showCloseButton
        classNames={styles['stepper-sections__info-section__modal-container']}
        data-test-id="terms-and-conditions-modal"
      >
        <Header>{title}</Header>
        <Body>
          <div className={styles['stepper-sections__info-section__modal']}>
            <PreviewLink
              link={link}
              isPdf={link !== action?.link}
              fileName={fileName}
            />
          </div>
        </Body>
        <Footer>
          <Button type="primary" disabled={!!inputObj?.value} onClick={onAgree}>
            {locale(Keys.AGREE)}
          </Button>
        </Footer>
      </Modal>
    </div>
  );
}
