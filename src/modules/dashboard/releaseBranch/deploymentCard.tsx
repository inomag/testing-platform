import React, { useCallback } from 'react';
import { Button, Loader, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import classnames from 'classnames';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch } from 'src/store/hooks';
import { fetchNextReleaseBranch } from '../thunk';
import styles from './index.module.scss';

export interface ProcessedDeployment {
  branch: string;
  pipeline: {
    id: string;
    status: {
      state: 'COMPLETED' | 'IN_PROGRESS';
      result: 'SUCCESSFUL' | 'FAILED';
    };
  };
  links: {
    branch: string;
    pipeline: string;
  };
}

export interface DeploymentCardData {
  completed: ProcessedDeployment | null;
  inProgress: ProcessedDeployment | null;
  undeployed: ProcessedDeployment | null;
}

export interface DeploymentCardProps {
  environment: string;
  project: string;
  isDashboardAdmin?: boolean;
  setReleaseBranch: (branch: string) => void;
}

export function DeploymentCard({
  completed,
  inProgress,
  undeployed,
  environment,
  project,
  setReleaseBranch,
  isDashboardAdmin,
}: DeploymentCardData & DeploymentCardProps) {
  const dispatch = useAppDispatch();

  const onClickPatchCurrent = useCallback(
    (branch: string) => {
      setReleaseBranch(branch);
      dispatch(
        fetchNextReleaseBranch({
          project,
          releaseBranch: branch,
          type: 'patch',
          confirm: false,
        }),
      );
    },
    [dispatch, project, setReleaseBranch],
  );

  return (
    <Card classNames={styles.releaseBranchHistory__header__deployments__card}>
      <Text type="h5">{environment}</Text>
      {completed && (
        <div
          className={
            styles.releaseBranchHistory__header__deployments__card__deploymentStatus
          }
        >
          <Text type="label">{locale(Keys.CURRENT)}</Text>
          <Text link={completed.links.branch}>{completed.branch}</Text>
          <Text
            type="label"
            link={completed.links.pipeline}
            classNames={classnames(styles.pipelineStatus, {
              [styles.success]:
                completed.pipeline.status.result === 'SUCCESSFUL',
              [styles.failed]: completed.pipeline.status.result === 'FAILED',
            })}
          >
            {completed.pipeline.id}
          </Text>
        </div>
      )}
      {undeployed && (
        <div
          className={
            styles.releaseBranchHistory__header__deployments__card__deploymentStatus
          }
        >
          <Text type="label">{locale(Keys.UNDEPLOYED)}</Text>
          <Text link={undeployed.links.branch}>{undeployed.branch}</Text>
          <Text type="label" link={undeployed.links.pipeline}>
            {undeployed.pipeline.id}
          </Text>
        </div>
      )}

      {inProgress && (
        <div
          className={
            styles.releaseBranchHistory__header__deployments__card__deploymentStatus
          }
        >
          <Text type="label">{locale(Keys.IN_PROGRESS)}</Text>
          <Text link={inProgress.links.branch}>{inProgress.branch}</Text>
          <div className={styles.pipelineStatus}>
            <Text type="label" link={inProgress.links.pipeline}>
              {inProgress.pipeline.id}
            </Text>
            <Loader visible size="small" />
          </div>
        </div>
      )}
      <div>
        {isDashboardAdmin && completed && (
          <Button
            size="small"
            type="outlined"
            onClick={() =>
              onClickPatchCurrent(inProgress?.branch ?? completed.branch)
            }
          >
            {locale(Keys.PATCH_CURRENT)}
          </Button>
        )}
      </div>
    </Card>
  );
}
