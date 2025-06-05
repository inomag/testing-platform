import React, { useCallback, useMemo, useState } from 'react';
import { Button, Select, Text } from 'src/@vymo/ui/atoms';
import { Card, ImageLoader } from 'src/@vymo/ui/blocks';
import Form from 'src/@vymo/ui/molecules/form';
import FormItem from 'src/@vymo/ui/molecules/form/formItem';
import { getGrowthBookFeatureFlag } from 'src/featureFlags';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppSelector } from 'src/store/hooks';
import { getFeatureBranchUrlsByProject } from '../selectors';
import { projects } from './constants';
import {
  getAppOptions,
  getFeatureBranch,
  getPortalOptionsByApp,
  getProjectOptions,
} from './queries';
import styles from './index.module.scss';

export default function FeatureBranch() {
  const [featureBranchState, setFeatureBranchState] = useState({
    project: { value: '', code: '' },
    app: { value: '', code: '' },
    branch: { value: '', code: '' },
    webPlatformBranch: { value: '', code: '' },
  });

  const [errorMessage, setErrorMessage] = useState('');

  const featureBranches = useAppSelector((state) =>
    getFeatureBranchUrlsByProject(state, featureBranchState.project.value),
  );

  const webPlatformFeatureBranches = useAppSelector((state) =>
    getFeatureBranchUrlsByProject(state, projects.webPlatform),
  );

  const podEnvSupported =
    (getGrowthBookFeatureFlag('podEnv-supported') ?? {})[
      featureBranchState.project.value
    ] ?? [];

  const onChangeForm = useCallback(
    (formData) => {
      formData = Object.entries(formData).reduce((acc, [key, data]) => {
        acc[key] = {};
        // @ts-ignore
        acc[key].value = data?.value?.[0]?.value ?? data?.value;
        return acc;
      }, {});

      setErrorMessage('');

      setFeatureBranchState({
        ...featureBranchState,
        ...formData,
      });
    },
    [featureBranchState],
  );

  const portalOptions = useMemo(
    () => getPortalOptionsByApp(featureBranchState.app.value),
    [featureBranchState.app.value],
  );

  return (
    <div className={styles.featureBranch}>
      <div className={styles.featureBranch__header}>
        <ImageLoader
          alt="Vymo Feature Branch"
          src="https://staging.lms.getvymo.com/v2/selfserve/vymo.png"
        />

        <Text type="h4">{locale(Keys.VYMO_FEATURE_BRANCH)}</Text>
      </div>

      <Card classNames={styles.featureBranch__container}>
        <Form
          name="featureBranch"
          onChange={onChangeForm}
          span="1fr"
          value={featureBranchState}
        >
          <FormItem code="project" label={locale(Keys.PROJECT)}>
            <Select options={getProjectOptions()} />
          </FormItem>

          {featureBranchState.project?.value && (
            <FormItem code="branch" label={locale(Keys.FEATURE_BRANCH)}>
              <Select search options={featureBranches} />
            </FormItem>
          )}

          {featureBranchState.project?.value === 'webPlatform' &&
            featureBranchState.branch.value && (
              <>
                <FormItem code="app" label={locale(Keys.APP)}>
                  <Select search options={getAppOptions()} />
                </FormItem>

                {portalOptions.length > 0 && (
                  <FormItem
                    code="portalId"
                    label={locale(Keys.PORTAL_ID_CLIENT_ID)}
                  >
                    {/* @ts-ignore */}
                    <Select search options={portalOptions} />
                  </FormItem>
                )}
              </>
            )}

          {featureBranchState.project?.value === 'vymoWeb' &&
            featureBranchState.branch.value && (
              <FormItem
                code="webPlatformBranch"
                label={locale(Keys.WEBPLATFORM_BRANCH)}
              >
                <Select search options={webPlatformFeatureBranches} />
              </FormItem>
            )}
        </Form>

        <div>
          <Text type="sublabel" variant="error">
            {errorMessage}
          </Text>
        </div>

        {featureBranchState.branch.value && (
          <div>
            <div className={styles.featureBranch__container__links}>
              <Text type="label" bold>
                {locale(Keys.LAUNCH_APP)}
              </Text>
              {podEnvSupported.map((podEnv) => (
                <Button
                  type="text"
                  // eslint-disable-next-line consistent-return
                  onClick={() => {
                    const featureUrl = getFeatureBranch(
                      featureBranchState,
                      portalOptions,
                    );

                    if (featureUrl === 'notValid') {
                      setErrorMessage(
                        locale(Keys.VALIDATION_SELECT_ALL_FIELDS),
                      );
                      return null;
                    }

                    window.open(
                      `http://${podEnv}.lms.getvymo.com/${featureUrl}`,
                      `${podEnv}__${featureUrl}`,
                    );
                  }}
                  key={podEnv}
                >
                  {podEnv}
                </Button>
              ))}
            </div>

            <Button
              type="text"
              variant="info"
              onClick={() => {
                window.open(
                  `http://staging.lms.getvymo.com/${getFeatureBranch(
                    featureBranchState,
                    portalOptions,
                  )}coverage/index.html`,
                  '__blank',
                );
              }}
            >
              {locale(Keys.COVERAGE)}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
