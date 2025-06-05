import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import * as Atoms from 'src/@vymo/ui/atoms';
import * as Blocks from 'src/@vymo/ui/blocks';
import * as Molecules from 'src/@vymo/ui/molecules';
import useValidator from 'src/@vymo/ui/molecules/form/formItem/useValidator';
import { Editor } from '@monaco-editor/react';
import { ReactComponent as Failed } from 'src/assets/icons/error.svg';
import useContainerSize from 'src/hooks/useContainerSize';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { setAppHideConfig } from 'src/models/appConfig/slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getModuleProps } from 'src/workspace/utils';
import { getProjectConfig, getTemplateConfig } from '../selectors';
import { setProjectConfig, setRunnerData } from '../slice';
import { handleChange, resolveProps } from './queries';
import { getRunnerData } from './selectors';
import styles from './index.module.scss';

function DynamicComponentLoader({ componentType, elementType, ...props }) {
  const [components] = useState({
    atoms: Atoms,
    blocks: Blocks,
    molecules: Molecules,
  });

  const Component =
    components?.[componentType]?.[elementType] ||
    (() => <div>{locale(Keys.COMPONENT_NOT_FOUND)}</div>);
  return (
    <Component {...props}>
      {/* @ts-ignore */}
      {props?.children}
    </Component>
  );
}

/**
 * Render a single UI element
 */
function RenderNode({ node, config, setConfig, dispatch, runnerData }) {
  const style = {
    position: 'absolute',
    top: `${node.position.y}px`,
    left: `${node.position.x}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
  };

  const resolvedProps = {
    ...resolveProps(node.data, config),
    hideValidation: true,
  };

  // @ts-ignore
  const currentValue = resolveProps?.value;

  const { validate } = useValidator(
    '',
    currentValue,
    node.data?.code,
    node?.data?.required,
    null,
    node?.data?.type,
    node?.data?.validations,
    config,
  );

  // Attach `onChange` handler for Inputs if needed
  if (
    ['Input', 'Select', 'Switch', 'Textarea', 'MultiTagInput'].includes(
      node.type,
    )
  ) {
    resolvedProps.onChange = (
      value,
      event,
      additionalData,
      validValue,
      currentError,
    ) => {
      const updatedValue = handleChange({
        value,
        event,
        additionalData,
        validValue,
        currentError,
        node,
        config,
        setConfig,
      });
      const { path } = node.data.value || {};
      const { isCurrentValid, currentErrors } = validate(updatedValue, {});
      const [, formPath] = path.replace(/[{}]/g, '').split('__');
      if (formPath) {
        dispatch(
          setRunnerData({
            id: node.id,
            error: currentErrors[0],
            valid: isCurrentValid,
            payload: { [formPath]: updatedValue },
          }),
        );

        dispatch(
          setAppHideConfig({ hide: { selfserveSaveDiscardButtons: false } }),
        );
      }
    };
  }

  return (
    // @ts-ignore
    <div style={style}>
      <div
        className={
          !isEmpty(runnerData?.error?.[node.id])
            ? styles.item_wrapper__error
            : ''
        }
      >
        <DynamicComponentLoader
          key={node.id}
          componentType={node.data.componentType}
          elementType={node.data.elementType}
          {...resolvedProps}
        />
      </div>
      {!isEmpty(runnerData?.error?.[node.id]) && (
        <div className={styles.item_wrapper__item__error}>
          <Failed />
          <span className={styles.item_wrapper__item__error_msg}>
            {runnerData.error[node.id]}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Runner component
 */
function Runner({ showPayloadAccordion = true }) {
  const templateConfig = useAppSelector(getTemplateConfig);
  const projectConfig = useAppSelector(getProjectConfig);
  const runnerData = useAppSelector(getRunnerData);
  // const [config, setConfig] = useState({}); // Holds the current config state

  const [containerRef, size] = useContainerSize();

  const [isLoading, seIsLoading] = useState(true);

  useEffect(() => {
    if (templateConfig.api.configPath.length > 0 && !showPayloadAccordion) {
      seIsLoading(true);
      getModuleProps()?.fetchModules?.(() => seIsLoading(false));
    } else {
      seIsLoading(false);
    }
  }, [templateConfig.api.configPath.length, showPayloadAccordion]);

  const dispatch = useAppDispatch();
  if (isLoading) {
    return <Atoms.Loader fullPage />;
  }
  return (
    <>
      <div ref={containerRef} style={{ position: 'relative', ...size }}>
        {templateConfig.ui.map((node) => (
          <RenderNode
            key={node.id}
            node={node}
            config={projectConfig}
            setConfig={(updatedConfig) => {
              dispatch(setProjectConfig(updatedConfig));
            }}
            dispatch={dispatch}
            runnerData={runnerData}
          />
        ))}
      </div>
      {showPayloadAccordion && (
        <div className={styles.code_editor_wrapper}>
          <Atoms.Divider />
          <Blocks.Collapsible title="Payload" open={false} iconPosition="left">
            <div className={styles.code_editor_wrapper__codeEditor}>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={JSON.stringify(projectConfig, null, 4)}
                theme="vs-dark"
                loading={locale(Keys.LOADING_CONFIG_EDITOR)}
                options={{
                  autoDetectHighContrast: true,
                  scrollBeyondLastLine: false,
                  fontSize: 16,
                }}
              />
            </div>
          </Blocks.Collapsible>
        </div>
      )}
    </>
  );
}

export default Runner;
// dynamic - > path+ {{}} => regex
