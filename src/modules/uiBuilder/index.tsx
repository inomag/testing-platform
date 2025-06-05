import React, { useEffect, useState } from 'react';
import { Button, Loader, Text } from 'src/@vymo/ui/atoms';
import { ReactComponent as EditIcon } from 'src/assets/icons/edit.svg';
import { ReactComponent as NewIcon } from 'src/assets/icons/newFile.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch } from 'src/store/hooks';
import ProjectInit from './builder/header/settings/projectInit';
import RunProject from './home/runProject';
import SelectTemplate from './home/selectTemplate';
import { resetProjectData } from './slice';
import { Templates } from './types';
import { getTemplates } from './utils';
import styles from './index.module.scss';

function UIBuilder() {
  const dispatch = useAppDispatch();

  const [viewIndex, setViewIndex] = useState(0);

  const [templates, setTemplates] = useState<Templates>();

  const [isLoading, setIsLoading] = useState(true);

  const [mode, setMode] = useState<'edit' | 'new' | 'run'>('new');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const templatesData = await getTemplates();

      setTemplates(templatesData);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Loader fullPage />;
  }

  return (
    <div className={styles.builderHome}>
      <div className={styles.builderHome__header}>
        <Text>{locale(Keys.UI_BUILDER)}</Text>
        <Text>{locale(Keys.FRONTEND_EVOLVED)}</Text>
      </div>

      <div className={styles.builderHome__content}>
        <div className={styles.builderHome__content__section}>
          <div className={styles.builderHome__content__section__box}>
            <Text classNames={styles.builderHome__content__section__box__title}>
              {locale(Keys.START)}
            </Text>
            <Button
              type="text"
              iconProps={{ icon: <NewIcon />, iconPosition: 'left' }}
              onClick={() => {
                dispatch(resetProjectData());
                setViewIndex(2);
                setMode('new');
              }}
            >
              {locale(Keys.NEW_PROJECT)}
            </Button>

            <Button
              type="text"
              iconProps={{ icon: <EditIcon />, iconPosition: 'left' }}
              onClick={() => {
                dispatch(resetProjectData());
                setMode('edit');
                setViewIndex(1);
              }}
            >
              {locale(Keys.EDIT_EXISTING_UI)}
            </Button>
          </div>

          <div className={styles.builderHome__content__section__box}>
            <Text classNames={styles.builderHome__content__section__box__title}>
              {locale(Keys.RECENT)}
            </Text>
            <SelectTemplate templates={templates as Templates} isLocal />
          </div>
        </div>
        <div className={styles.builderHome__content__section}>
          <div className={styles.builderHome__content__section__box}>
            <Text classNames={styles.builderHome__content__section__box__title}>
              {locale(Keys.RUN_PROJECT)}
            </Text>
            <RunProject templates={templates as Templates} />
          </div>
        </div>
      </div>

      {['new', 'edit'].includes(mode) && (
        <>
          {viewIndex === 1 && (
            <SelectTemplate
              templates={templates as Templates}
              showModalOnly
              goToStep={setViewIndex}
            />
          )}

          {viewIndex === 2 && (
            <ProjectInit open goToStep={setViewIndex} mode={mode} />
          )}
        </>
      )}
    </div>
  );
}

export default UIBuilder;
