import _ from 'lodash';

export class BaseContext {
  context: {
    [key: string]: any;
  };

  constructor(context: any) {
    this.context = context;
  }

  get(attribute: string, ...path): string | object {
    let element = this.context;
    if (path) {
      path.forEach((pathAttr) => {
        element = _.get(element, pathAttr);
      });
    }
    return _.get(element, attribute);
  }
}
