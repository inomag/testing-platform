import _ from 'lodash';
import React, { useCallback } from 'react';
import { Button, Input, Loader, Select, Text } from 'src/@vymo/ui/atoms';
import { Body, Footer, Header, Modal } from 'src/@vymo/ui/blocks';
import Tooltip from 'src/@vymo/ui/blocks/tooltip';
import { DocumentUploader } from 'src/@vymo/ui/molecules';
import { MimeTypes } from 'src/@vymo/ui/molecules/documentUploader/constants';
import { Editor } from '@monaco-editor/react';
import { ReactComponent as ErrorStatusIcon } from 'src/assets/icons/errorStatus.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icons/successCircle.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { setItem } from 'src/indexDb/db';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { renderModule } from 'src/workspace/slice';
import { base64ToFile } from 'src/workspace/utils';
import { getProjectData } from '../../../selectors';
import {
  setProjectConfig,
  setProjectData,
  setProjectName,
} from '../../../slice';
import { validateJiraId } from '../../thunk';
import styles from '../../../index.module.scss';

function ProjectInit({
  open,
  setOpen = _.noop,
  goToStep = _.noop,
  mode,
}: {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  goToStep?: (step: number) => void;
  mode: 'edit' | 'new' | 'run' | 'build';
}) {
  const dispatch = useAppDispatch();

  const projectConfig = useAppSelector(getProjectData);

  const setNewProjectName = (value: string) => {
    dispatch(setProjectName({ name: value, isNew: mode === 'new' }));
  };

  const setNewtemplateJiraID = (value: string) => {
    if (value.length > 3) {
      dispatch(validateJiraId(value));
    }
  };

  const deebounceSetJiraId = _.debounce(setNewtemplateJiraID, 1000);

  const onClickSave = useCallback(async () => {
    if (mode === 'build') {
      setOpen(false);
    } else {
      await setItem(`appBuilder__${projectConfig.code}`, projectConfig);
      dispatch(
        renderModule({
          id: 'UI_BUILDER',
          props: { appProjectName: projectConfig.name },
        }),
      );
    }
  }, [dispatch, mode, projectConfig, setOpen]);

  const setNewTemplateName = (value: string) => {
    const updatedProjectConfig = {
      ...projectConfig,
      tile: { ...projectConfig.tile, name: value },
    };
    dispatch(setProjectData(updatedProjectConfig));
  };

  const setNewTemplateDescription = (value: string) => {
    const updatedProjectConfig = {
      ...projectConfig,
      tile: { ...projectConfig.tile, description: value },
    };
    dispatch(setProjectData(updatedProjectConfig));
  };

  const setNewTemplateIcon = (files) => {
    const { file } = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedProjectConfig = {
          ...projectConfig,
          tile: { ...projectConfig.tile, icon: reader.result },
        };
        dispatch(setProjectData(updatedProjectConfig));
      };

      reader.readAsDataURL(file);
    } else {
      const updatedProjectConfig = {
        ...projectConfig,
        tile: { ...projectConfig.tile, icon: '' },
      };
      dispatch(setProjectData(updatedProjectConfig));
    }
  };

  const unsetNewTemplateIcon = () => {
    const updatedProjectConfig = {
      ...projectConfig,
      tile: { ...projectConfig.tile, icon: '' },
    };
    dispatch(setProjectData(updatedProjectConfig));
  };

  const handleProjectConfigChange = (value: string | undefined) => {
    let parsedValue = {};
    try {
      parsedValue = JSON.parse(value || '{}');
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    dispatch(setProjectConfig(parsedValue));
  };

  const iconFile = base64ToFile(projectConfig.tile.icon);

  return (
    <Modal open={open} showCloseButton={false}>
      <Header>
        <Text type="h2">{locale(Keys.TEMPLATE_CONFIG)}</Text>
      </Header>
      <Body className={styles.projectSetting__body}>
        <div>
          <Text type="label">{locale(Keys.SELECT_THE_APP)}</Text>
          <Select
            value="selfserve"
            disabled
            options={[
              { value: 'web', label: locale(Keys.WEB) },
              { value: 'selfserve', label: locale(Keys.SELFSERVE) },
              { value: 'webPlatform', label: locale(Keys.WEB_PLATFORM) },
            ]}
          />
        </div>

        <div>
          <Text type="label">{locale(Keys.ENTER_JIRA_TICKET_ID)}</Text>
          <div className={styles.projectSetting__body__jira}>
            <Input
              disabled={projectConfig.jira.validated === 'in_progress'}
              value={projectConfig.jira.id}
              onChange={deebounceSetJiraId}
            />

            {projectConfig.jira.validated === 'in_progress' && (
              <Loader visible />
            )}
            {projectConfig.jira.validated === 'completed' && <CheckIcon />}
            {projectConfig.jira.validated === 'error' && <ErrorStatusIcon />}
          </div>
          {projectConfig.jira.validated === 'error' &&
            projectConfig.jira.error && (
              <Text variant="error">{projectConfig.jira.error}</Text>
            )}
        </div>

        <div>
          <Text type="label">{locale(Keys.ENTER_PROJECT_NAME)}</Text>
          <Input
            disabled={mode !== 'new'}
            value={projectConfig.name}
            onChange={setNewProjectName}
          />
        </div>

        {mode === 'new' ? (
          <div>
            <Tooltip content={locale(Keys.UNIQUE_CODE_UI_FILENAME_INFO)}>
              <Text type="label">{locale(Keys.CODE)}</Text>
            </Tooltip>
            <Text> {projectConfig.code}</Text>
          </div>
        ) : (
          <div>
            <Text type="label">{locale(Keys.TEMPLATE_LINKED)}</Text>
            <Button type="link"> {projectConfig.code}</Button>
          </div>
        )}

        <div>
          <Text type="label">{locale(Keys.ENTER_FEATURE_TILE_NAME)}</Text>
          <Input
            value={projectConfig.tile.name}
            onChange={setNewTemplateName}
          />
        </div>

        <div>
          <Text type="label">
            {locale(Keys.ENTER_FEATURE_TILE_DESCRIPTION)}
          </Text>
          <Input
            value={projectConfig.tile.description}
            onChange={setNewTemplateDescription}
          />
        </div>

        <div>
          <Text type="label">{locale(Keys.ENTER_FEATURE_TILE_ICON)}</Text>
          <DocumentUploader
            maxSize={102400}
            maxFiles={1}
            acceptedMimeTypes={[MimeTypes.SVG, MimeTypes.JPEG]}
            onFileUpload={setNewTemplateIcon}
            editTool
            onFileRemove={unsetNewTemplateIcon}
            documents={
              projectConfig.tile.icon
                ? [{ file: iconFile, id: Math.random(), mime: iconFile.type }]
                : []
            }
            fieldCode="icon"
          />
        </div>

        <div>
          <Text type="label">{locale(Keys.ENTER_SELFSERVE_CONFIG)}</Text>
          <Editor
            width="800px"
            height="600px"
            defaultLanguage="json"
            onChange={handleProjectConfigChange}
            defaultValue={JSON.stringify(projectConfig.config, null, 4)}
            theme="vs-dark"
            options={{
              autoDetectHighContrast: true,
              scrollBeyondLastLine: false,
              fontSize: 16,
            }}
          />
        </div>
      </Body>
      <Footer>
        <Button
          type="text"
          onClick={() => (mode === 'build' ? setOpen(false) : goToStep(0))}
        >
          {locale(Keys.CANCEL)}
        </Button>
        {mode === 'edit' && (
          <Button type="text" onClick={() => goToStep(1)}>
            {locale(Keys.BACK)}
          </Button>
        )}

        <Button onClick={onClickSave}>
          {mode === 'build' ? locale(Keys.UPDATE) : locale(Keys.DONE)}
        </Button>
      </Footer>
    </Modal>
  );
}

export default ProjectInit;
