import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getIsIsacButtonEnabled } from 'src/models/lmsConfig/queries';
import { getWorkflowActionState } from 'src/models/lmsConfig/selectors';
import { setWorkflowActionState } from 'src/models/lmsConfig/slice';
import { WORKFLOW_FORM } from 'src/modules/constants';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { renderDialog } from 'src/workspace/slice';
import { getClientConfigData } from 'src/workspace/utils';
import { getCardData } from '../selectors';
import { fetchHeaderDetails } from '../thunk';
import {
  canEnableDisableUser,
  customButtonEnabledBasedOnStatus,
  getCustomButtonVisibility,
  getUserActionButtonsConfig,
  getUserOptionConfigs,
  isCustomButtonEnabled,
  isUserApprovalStatusPending,
} from './queries';
import styles from './index.module.scss';

function UserActions() {
  const dispatch = useAppDispatch();
  const [currentAction, setCurrentAction] = useState(null);

  const user = useAppSelector((state) => getCardData(state, 'header'));
  const workflowActionState = useAppSelector(getWorkflowActionState);

  const config = getClientConfigData();
  const userActionButtons = useMemo(
    () => getUserActionButtonsConfig(config, user),
    [config, user],
  );

  const isacButtonEnabled = getIsIsacButtonEnabled();
  const userOptionConfigs = getUserOptionConfigs(config);
  const customButtonVisibility = getCustomButtonVisibility(config);

  useEffect(() => {
    if (workflowActionState === 'success') {
      dispatch(fetchHeaderDetails({ userCode: user?.code }));
      setCurrentAction(null);
      dispatch(setWorkflowActionState('initial'));
    }
  }, [currentAction, dispatch, user?.code, workflowActionState]);

  const buttonConfig: any = useMemo(() => {
    if (_.isEmpty(userOptionConfigs)) {
      return Object.values(userActionButtons);
    }
    let customButtons = {};
    Object.keys(userOptionConfigs).forEach((buttonKey) => {
      const buttonInfo = userOptionConfigs[buttonKey];
      let button = { ...(userActionButtons[buttonKey] || {}) };
      if (buttonInfo.mapsTo === 'custom') {
        button.hidden = false;
        button.buttonText = buttonInfo.name;
        button.disabled =
          !isCustomButtonEnabled(
            buttonInfo.record_level_action_condition,
            user,
          ) ||
          !canEnableDisableUser(config) ||
          isUserApprovalStatusPending(user);
        if (isacButtonEnabled) {
          button.disabled = customButtonEnabledBasedOnStatus(
            button,
            buttonInfo,
            user,
            customButtonVisibility,
          );
        }
      } else {
        button = userActionButtons[buttonInfo.mapsTo];
        button.name = button.buttonText || buttonInfo.name;
        if (isacButtonEnabled) {
          button.disabled = customButtonEnabledBasedOnStatus(
            button,
            buttonInfo,
            user,
            customButtonVisibility,
          );
        }
      }
      button.hidden = button?.hidden || buttonInfo?.hidden;
      customButtons = { ...customButtons, [buttonKey]: button };
    });
    return Object.values(customButtons);
  }, [
    userOptionConfigs,
    userActionButtons,
    user,
    config,
    isacButtonEnabled,
    customButtonVisibility,
  ]);

  const userData = useAppSelector((state) => getCardData(state, 'header'));

  const handleOnClick = (button) => {
    setCurrentAction(button.key);
    dispatch(
      renderDialog({
        id: WORKFLOW_FORM,
        props: { action: button.key, moduleCode: 'user', voId: userData.code },
      }),
    );
  };

  return (
    <div className={styles.userActionWrapper}>
      <div className={styles.userActionWrapper__customActions}>
        {buttonConfig
          .filter((button) => !button.disabled && !button.hidden)
          .map((button) => (
            <Button
              className={styles.userAction}
              disabled={button.disabled}
              onClick={() => handleOnClick(button)}
            >
              {button.name}
            </Button>
          ))}
      </div>
      <div>
        <Button
          className={styles.userAction__activity}
          onClick={() =>
            handleOnClick({
              key: 'create_task',
            })
          }
        >
          {locale(Keys.ADD_ACTIVITY)}
        </Button>
      </div>
    </div>
  );
}

export default UserActions;
