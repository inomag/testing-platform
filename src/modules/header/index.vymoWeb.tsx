import React, { useCallback, useState } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Breadcrumb from 'src/@vymo/ui/atoms/breadcrumb';
import Modal, { Body, Header } from 'src/@vymo/ui/blocks/modal';
import classNames from 'classnames';
import { ReactComponent as ToolTip } from 'src/assets/icons/tooltip.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getPageDirty } from 'src/models/appConfig/selectors';
import { setPageDirty } from 'src/models/appConfig/slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getModuleProps } from 'src/workspace/utils';
import styles from './index.module.scss';

type PendingNavigation = {
  path: string;
  navigate: (path: string) => void;
} | null;

function NavigationHeader({ navigationItems }) {
  const dispatch = useAppDispatch();
  const isPageDirty = useAppSelector(getPageDirty);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation>(null);
  const leadStepper = getModuleProps()?.scenario === 'leadStepper';

  const handleConfirmNavigation = () => {
    if (pendingNavigation && pendingNavigation.navigate) {
      pendingNavigation.navigate?.(pendingNavigation.path);
      setModalOpen(false);
      setPendingNavigation(null);
      dispatch(setPageDirty(false));
    }
  };

  const onBeforeNavigate = useCallback(
    (path, navigate) => {
      if (isPageDirty) {
        setPendingNavigation({
          path,
          navigate,
        });
        setModalOpen(true);
      } else {
        navigate?.(path);
      }
    },
    [isPageDirty],
  );

  const handleCancelNavigation = () => {
    setModalOpen(false);
    setPendingNavigation(null);
  };

  const placeholderClass = classNames(
    styles.navigationHeader__placeholder,
    leadStepper && styles.navigationHeader___leadStepperPlaceholder,
  );

  return (
    <>
      <div className={styles.navigationHeader} id="lmsWebHeader">
        <Breadcrumb
          items={(navigationItems || []).map(({ path, breadcrumbName }) => ({
            path,
            title: breadcrumbName,
            onBeforeNavigate: (navigate) => onBeforeNavigate(path, navigate),
          }))}
        />
      </div>
      <div className={placeholderClass} />
      {isModalOpen && (
        <Modal
          classNames={styles.pageDirtyConfirmModal}
          onClose={handleCancelNavigation}
        >
          <Header className={styles.pageDirtyConfirmModal__header}>
            <ToolTip /> {locale(Keys.UNSAVED_CHANGES)}
          </Header>
          <Body>
            <div className={styles.pageDirtyConfirmModal__body}>
              <p>{locale(Keys.WARNING_UNSAVED_CHANGES_CONFIRM_LEAVE)}</p>
              <div className={styles.pageDirtyConfirmModal__footer}>
                <Button onClick={handleCancelNavigation}>
                  {locale(Keys.CANCEL)}
                </Button>
                <Button onClick={handleConfirmNavigation}>
                  {locale(Keys.LEAVE)}
                </Button>
              </div>
            </div>
          </Body>
        </Modal>
      )}
    </>
  );
}

export default NavigationHeader;
