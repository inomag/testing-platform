import React, { useEffect, useMemo } from 'react';
import Modal, { Body } from 'src/@vymo/ui/blocks/modal';
import { ModuleTypeValue } from 'src/modules/types';
import { useAppDispatch } from 'src/store/hooks';
import { getModuleById, getModulesConfig, getStyle } from './queries';
import { removeDialog } from './slice';

type Props = {
  id: ModuleTypeValue | 'router';
  isDialog?: Boolean;
  props?: Record<
    string,
    boolean | string | number | ((...args: any) => void) | React.CSSProperties
  >;
};

/**
 * ChildComponent is used to render full page module inside workspace like Manage Channel,Playbook,Sample Module through renderModule
 * ChildComponent is used by module to load nested modules in jsx through <ChildComponent id="SAMPLE" props={}/>.
 */

function ChildComponent({ id, props, isDialog = false }: Props) {
  const dispatch = useAppDispatch();
  const moduleConfig = useMemo(() => getModulesConfig(false), []);

  const module = useMemo(
    () => getModuleById(id, moduleConfig),
    [id, moduleConfig],
  );

  useEffect(() => {
    // thunk activate
    module?.thunk?.onActivate?.({ dispatch, props });
    return () => {
      module?.thunk?.onDeactivate?.({ dispatch, props });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const Component: any = module?.component;

  if (isDialog) {
    const style = getStyle(module?.dialog?.styles);
    // TODO :: Add support for Header & Footer in dialog
    return (
      <Modal
        style={style}
        onClose={() =>
          dispatch(
            removeDialog({
              // @ts-ignore
              id,
            }),
          )
        }
        {...(module?.dialog?.props || {})}
      >
        <Body>
          <Component {...props} />
        </Body>
      </Modal>
    );
  }
  if (module?.element) {
    return <Component {...props} />;
  }
  return (
    <div>{`Module with id ${id} does not exist. Check in src/module/constants matches the module id ${id} or the module is imported in modulesReducerConfig`}</div>
  );
}

export default React.memo(ChildComponent);
