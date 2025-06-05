import { WORKFLOW_FORM } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import WorkflowForm from './index';
import WorkflowFormThunk from './thunk';

// TODO :: better name for module
const module: ModulesList = {
  [WORKFLOW_FORM]: {
    path: '/form/:moduleCode/:voId/:action',
    component: WorkflowForm,
    thunk: WorkflowFormThunk,
    dialog: {
      styles: {
        d: {
          w: '70vw',
          h: '70vh',
        },
      },
      props: {
        showCloseButton: true,
      },
    },
  } as Module,
};

export default module;
