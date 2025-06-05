import { isEmpty } from 'lodash';
import React, { ReactNode } from 'react';
import { Divider, ProgressBar, Text } from 'src/@vymo/ui/atoms';
import { Collapsible } from 'src/@vymo/ui/blocks';
import { ReactComponent as Selected } from 'src/assets/icons/active.svg';
import { ReactComponent as Completed } from 'src/assets/icons/completed.svg';
import { ReactComponent as Open } from 'src/assets/icons/enabled.svg';
import { ReactComponent as Failed } from 'src/assets/icons/error.svg';
import { ReactComponent as Disabled } from 'src/assets/icons/lock.svg';
import { ReactComponent as InProgress } from 'src/assets/icons/pending.svg';
import { ReactComponent as ChevronRight } from 'src/assets/icons/right.svg';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getCurrentStep, getLobCode } from '../selectors';
import { useStepperContext } from '../stepperProvider';
import { init } from '../thunk';
import { getMilestones } from './selectors';
import { ChecklistProps } from './types';
import styles from './index.module.scss';

function Checklist({ setChecklistVisible }: ChecklistProps) {
  const { isDialog } = useStepperContext();
  const checkListData = useAppSelector((state) =>
    getMilestones(state, isDialog),
  );
  const currentStep = useAppSelector((state) =>
    getCurrentStep(state, isDialog),
  );

  const lobCode = useAppSelector(getLobCode);

  const dispatch = useAppDispatch();

  const statusIconMap = {
    completed: <Completed />,
    locked: <Disabled />,
    in_progress: <InProgress />,
    failed: <Failed />,
    default: <Open />,
  };

  const getStatusIcon = (status) =>
    statusIconMap[status] || statusIconMap.default;

  const onRedirectUrlClick = (event, status, actionCode) => {
    if (status !== 'locked') {
      event.stopPropagation();
      const url = (event.currentTarget as HTMLElement).getAttribute(
        'data-url',
      ) as string;

      if (url) {
        setChecklistVisible(false);
        dispatch(init({ actionCode, lobCode }));
      }
    }
  };

  const getMilestoneTitle = (milestone, type): ReactNode => (
    <div className={styles[`milestone__${type}__content__header__prefixIcon`]}>
      {getStatusIcon(milestone.status)}
      {milestone.name}
    </div>
  );

  const getStepContent = (step, type) => (
    <div
      onClick={(e) => onRedirectUrlClick(e, step.status, step.code)}
      onKeyPress={() => {}}
      className={styles[`milestone__${type}__content`]}
      data-test-id="milestones-wrapper"
      role="button"
      tabIndex={0}
      key={step.name}
      data-url={step?.metadata?.portal?.url}
    >
      <div className={styles[`milestone__${type}__content__header`]}>
        <div
          className={styles[`milestone__${type}__content__header__prefixIcon`]}
        >
          {type === 'action' && step.code === currentStep ? (
            <Selected />
          ) : (
            getStatusIcon(step.status)
          )}
        </div>
        <div className={styles[`milestone__${type}__content__header__title`]}>
          {step.name}
        </div>
        {type === 'action' && <ChevronRight />}
      </div>
      {step.description && (
        <div className={styles[`milestone__${type}__content__description`]}>
          <Text type="description">{step.description}</Text>
        </div>
      )}
      {step.actions?.map((action) => getStepContent(action, 'action'))}
    </div>
  );

  const getMilestone = (milestone) => (
    <Collapsible
      key={milestone.code}
      title={getMilestoneTitle(milestone, 'action')}
      description={
        milestone.progress?.percentage ? milestone.progress?.label : ''
      }
      open={!isEmpty(milestone.steps)}
      className={styles.milestone__collapse}
      iconLeft={getStatusIcon(milestone.status)}
    >
      {milestone?.steps?.length && (
        <>
          {Boolean(milestone.progress?.percentage) && (
            <ProgressBar
              classNames={styles.milestone__progress}
              value={milestone.progress?.percentage}
              showText={false}
              strokeRadius={false}
              variant="success"
              size="small"
            />
          )}
          <Divider />
          <div className={styles.milestone__step}>
            {milestone.steps?.map((step) => getStepContent(step, 'step'))}
          </div>
        </>
      )}
    </Collapsible>
  );

  return (
    <div className={styles.milestone}>
      {checkListData?.map((milestone) => getMilestone(milestone))}
    </div>
  );
}

export default React.memo(Checklist);
