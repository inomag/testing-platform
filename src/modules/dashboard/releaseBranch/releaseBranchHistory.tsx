import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Body, Footer, Header, Modal } from 'src/@vymo/ui/blocks';
import { getGrowthBookFeatureFlag } from 'src/featureFlags';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getReleaseBranchUrlsByProject, getReleaseData } from '../selectors';
import { setNextReleaseData } from '../slice';
import { fetchDeployments, fetchNextReleaseBranch } from '../thunk';
import { BranchItem, BranchItemData } from './branchItem';
import { DeploymentCard } from './deploymentCard';
import type { DeploymentCardData } from './deploymentCard';
import styles from './index.module.scss';

type ModalType = 'release' | 'patch' | undefined | false;

interface ReleaseData {
  prod: DeploymentCardData | null;
  preProd: DeploymentCardData | null;
  nextRelease: {
    type: 'release' | 'patch';
    name: string;
  } | null;
}

function ConfirmationModal({
  type,
  branchName,
  onConfirm,
  onClose,
}: {
  type: ModalType;
  branchName: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!type) return null;

  return (
    <Modal open showCloseButton={false}>
      <Header />
      <Body className={styles.releaseBranchHistory__modal__body}>
        <Text bold>
          {type === 'release'
            ? locale(Keys.CONFIRM_CREATE_RELEASE_BRANCH)
            : locale(Keys.CONFIRM_CREATE_PATCH_BRANCH)}
        </Text>
        <Text>{branchName}</Text>
      </Body>
      <Footer>
        <Button type="text" onClick={onClose}>
          {locale(Keys.NO)}
        </Button>
        <Button onClick={onConfirm}>{locale(Keys.YES)}</Button>
      </Footer>
    </Modal>
  );
}

interface ReleaseBranchHistoryProps {
  project: string;
}

export default function ReleaseBranchHistory({
  project,
}: ReleaseBranchHistoryProps) {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<ModalType>(false);
  const [releaseBranch, setReleaseBranch] = useState('');

  const isDashboardAdmin = getGrowthBookFeatureFlag('dashboard-admin');

  const releaseBranches = useAppSelector((state) =>
    getReleaseBranchUrlsByProject(state, project),
  ) as BranchItemData[];

  const releaseData = useAppSelector(getReleaseData) as ReleaseData;

  useEffect(() => {
    dispatch(fetchDeployments({ project }));
  }, [dispatch, project]);

  useEffect(() => {
    if (!_.isEmpty(releaseData.nextRelease)) {
      setModalOpen(releaseData?.nextRelease?.type);
    } else {
      setModalOpen(false);
    }
  }, [releaseData.nextRelease]);

  const onClickConfirmModal = useCallback(() => {
    if (!releaseData.nextRelease?.type) return;

    dispatch(
      fetchNextReleaseBranch({
        project,
        releaseBranch,
        type: releaseData.nextRelease.type,
        confirm: true,
      }),
    );
  }, [dispatch, project, releaseBranch, releaseData.nextRelease]);

  const onClickNewRelease = useCallback(() => {
    const branch = releaseBranches[0]?.branch ?? '';
    setReleaseBranch(branch);
    dispatch(
      fetchNextReleaseBranch({
        project,
        releaseBranch: branch,
        type: 'release',
        confirm: false,
      }),
    );
  }, [dispatch, project, releaseBranches]);

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
    dispatch(setNextReleaseData(null));
  }, [dispatch]);

  return (
    <div
      className={styles.releaseBranchHistory}
      data-test-id={`releaseBranchHistory-${project}`}
    >
      <div className={styles.releaseBranchHistory__header}>
        <div className={styles.releaseBranchHistory__header__deployments}>
          {releaseData.prod && (
            <DeploymentCard
              environment="Production"
              {...releaseData.prod}
              project={project}
              setReleaseBranch={setReleaseBranch}
              isDashboardAdmin={isDashboardAdmin}
            />
          )}
          {releaseData.preProd && (
            <DeploymentCard
              environment="Pre Prod"
              {...releaseData.preProd}
              project={project}
              setReleaseBranch={setReleaseBranch}
              isDashboardAdmin={isDashboardAdmin}
            />
          )}
        </div>
        {isDashboardAdmin && (
          <div className={styles.releaseBranchHistory__header__release}>
            <Button onClick={onClickNewRelease}>
              {locale(Keys.NEW_RELEASE)}
            </Button>
          </div>
        )}
      </div>

      <div className={styles.releaseBranchHistory__list}>
        {releaseBranches.map((branchData) => (
          <BranchItem key={branchData.branch} {...branchData} />
        ))}
      </div>

      <ConfirmationModal
        type={modalOpen}
        branchName={releaseData.nextRelease?.name || ''}
        onConfirm={onClickConfirmModal}
        onClose={onCloseModal}
      />
    </div>
  );
}
