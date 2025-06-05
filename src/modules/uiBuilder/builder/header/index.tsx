import React, { useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { List, Popup } from 'src/@vymo/ui/blocks';
import Notification from 'src/@vymo/ui/components/notification';
import { ReactComponent as DesktopIcon } from 'src/assets/icons/desktop.svg';
import { ReactComponent as SettingsIcon } from 'src/assets/icons/gear.svg';
import { ReactComponent as HomeIcon } from 'src/assets/icons/home.svg';
import { ReactComponent as LayoutIcon } from 'src/assets/icons/layout.svg';
import { ReactComponent as MobileIcon } from 'src/assets/icons/mobile.svg';
import { ReactComponent as PlayIcon } from 'src/assets/icons/play.svg';
import { ReactComponent as PreviewIcon } from 'src/assets/icons/preview.svg';
import { ReactComponent as TabletIcon } from 'src/assets/icons/tablet.svg';
import { ReactComponent as WarningIcon } from 'src/assets/icons/warningCircle.svg';
import useAutoSave from 'src/hooks/useAutosave';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { renderModule } from 'src/workspace/slice';
import { getAppBaseUrl, getAppOrigin, isDev } from 'src/workspace/utils';
import {
  getNotfications,
  getProjectData,
  getPublishData,
} from '../../selectors';
import { clearNotifications } from '../../slice';
import SaveTemplate from './saveTemplate';
import ProjectInit from './settings/projectInit';
import styles from './index.module.scss';

function Header({ layout, setLayout }) {
  const dispatch = useAppDispatch();
  const projectConfig = useAppSelector(getProjectData);

  const publishData = useAppSelector(getPublishData);

  const notifications = useAppSelector(getNotfications);

  const [showEditUiTemplateModal, setEditNewUiTemplateModal] = useState(false);

  const [, deleteItem] = useAutoSave(
    `appBuilder__${projectConfig.code}`,
    'uiBuilder.project.selfserve',
    2000,
    false,
  );

  return (
    <div className={styles.header}>
      <div className={styles.header__left}>
        <Button
          type="text"
          variant="filled"
          onClick={() => {
            dispatch(
              renderModule({
                id: 'UI_BUILDER_HOME',
                props: {},
              }),
            );
          }}
          iconProps={{ icon: <HomeIcon />, iconPosition: 'left' }}
        />
        <Popup
          closeTrigger="click"
          content={
            <List selectedIndex={layout} showSelected onItemClick={setLayout}>
              <List.Item className={styles.header__left__layout__item}>
                <MobileIcon /> {locale(Keys.MOBILE)}
              </List.Item>
              <List.Item className={styles.header__left__layout__item}>
                <TabletIcon /> {locale(Keys.TABLET)}
              </List.Item>
              <List.Item className={styles.header__left__layout__item}>
                <DesktopIcon /> {locale(Keys.DESKTOP)}
              </List.Item>
            </List>
          }
        >
          <Button
            type="text"
            variant="filled"
            iconProps={{ icon: <LayoutIcon />, iconPosition: 'left' }}
          />
        </Popup>

        <div>
          {/* <Text>Zoom: {zoom.toFixed(2)}</Text>
          <Button type="text" onClick={handleZoomReset}>
            Reset Zoom
          </Button> */}
        </div>
      </div>
      <div>
        <Text type="h3">{projectConfig.name}</Text>
      </div>
      <div className={styles.header__right}>
        <Button
          type="text"
          iconProps={{ icon: <PlayIcon />, iconPosition: 'left' }}
          onClick={() => {
            window.open(
              `${getAppBaseUrl()}#/runner/${projectConfig.name}`,
              '_blank',
            );
          }}
        />

        <Button
          type="text"
          iconProps={{ icon: <PreviewIcon />, iconPosition: 'left' }}
          variant="filled"
          onClick={() => {
            window.open(
              isDev()
                ? `http://localhost:3006/v2/selfserve/#/global_settings/features`
                : `${getAppOrigin()}/v2/selfserve/PE-11197/#/global_settings/features?branch=${
                    publishData.branch
                  }`,
              '_blank',
            );
          }}
        />

        <SaveTemplate />

        <Notification
          buttonVariant="filled"
          notifications={notifications}
          onClearAll={() => dispatch(clearNotifications())}
        />
        <Popup
          closeTrigger="click"
          content={
            <List>
              <List.Item
                className={styles.header__left__layout__item}
                onItemClick={() => setEditNewUiTemplateModal(true)}
              >
                {locale(Keys.TEMPLATE_CONFIG)}
              </List.Item>

              <List.Item
                className={styles.header__left__layout__item}
                onItemClick={() => {
                  deleteItem();
                  dispatch(renderModule({ id: 'UI_BUILDER_HOME', props: {} }));
                }}
              >
                {locale(Keys.DELETE_PROJECT)} <WarningIcon />
              </List.Item>
            </List>
          }
        >
          <Button
            type="text"
            variant="filled"
            iconProps={{ icon: <SettingsIcon />, iconPosition: 'left' }}
          />
        </Popup>

        <ProjectInit
          open={showEditUiTemplateModal}
          setOpen={setEditNewUiTemplateModal}
          mode="build"
        />
      </div>
    </div>
  );
}

export default Header;
