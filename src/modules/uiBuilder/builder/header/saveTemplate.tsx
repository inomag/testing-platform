import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Body, Footer, Header, Modal } from 'src/@vymo/ui/blocks';
import { ReactComponent as PullRequestIcon } from 'src/assets/icons/pullRequest.svg';
import { ReactComponent as PublishIcon } from 'src/assets/icons/upload.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getProjectData, getPublishData } from '../../selectors';
import { publishBranch } from '../thunk';
import styles from './index.module.scss';

function SaveTemplate() {
  const dispatch = useAppDispatch();
  const projectConfig = useAppSelector(getProjectData);
  const publishData = useAppSelector(getPublishData);

  const [showModal, setShowModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const { lastSaved } = projectConfig;

  const onPublishProjectConfig = useCallback(() => {
    setPublishing(true);
    setShowModal(false);
    dispatch(publishBranch(projectConfig));
  }, [dispatch, projectConfig]);

  useEffect(() => {
    if (['completed', 'error'].includes(String(publishData?.status))) {
      setPublishing(false);
    }
  }, [publishData.status]);

  return (
    <div className={styles.saveTemplate}>
      <Text variant={lastSaved ? 'info' : 'error'}>
        {lastSaved
          ? locale(Keys.AUTO_SAVED_AT, { lastSaved })
          : locale(Keys.NOT_SAVED)}
      </Text>

      <Button
        type="text"
        variant="filled"
        disabled={publishData.commitsSync === 0}
        onClick={() => setShowModal(true)}
        loading={publishing}
        iconProps={{ icon: <PublishIcon />, iconPosition: 'left' }}
      />

      {publishData.pr && (
        <Button
          type="text"
          variant="filled"
          onClick={() => window.open(publishData.pr, 'blank')}
          iconProps={{ icon: <PullRequestIcon />, iconPosition: 'left' }}
        />
      )}

      {showModal && (
        <Modal showCloseButton={false} onClose={() => setShowModal(false)}>
          <Header>{locale(Keys.PUBLISH_UI)}</Header>
          <Body className={styles.header__right__publish__modal__body}>
            <Text type="label">
              {locale(Keys.PROJECT_PUBLISH_FILENAME_INFO, {
                projectCode: projectConfig.code,
              })}
            </Text>
            <Text type="label">{locale(Keys.CONFIRMATION_PROCEED_ACTION)}</Text>
          </Body>
          <Footer>
            <Button type="text" onClick={() => setShowModal(false)}>
              {locale(Keys.CANCEL)}
            </Button>
            <Button onClick={onPublishProjectConfig}>
              {locale(Keys.PUBLISH)}
            </Button>
          </Footer>
        </Modal>
      )}
    </div>
  );
}

export default SaveTemplate;
