import { initLmsConfig } from 'src/models/auth/lmsLogin/thunk';

const onActivate = ({ dispatch }: any) => {
  dispatch(initLmsConfig());
};

export default { onActivate };
