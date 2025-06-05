import HeaderModule from 'src/modules/header/module';
import UIBuilderModule from 'src/modules/uiBuilder/module';
import uiBuilderSlice from 'src/modules/uiBuilder/slice';

export const moduleList = {
  ...HeaderModule,
  ...UIBuilderModule,
};

export const reducerList = {
  ...uiBuilderSlice,
};
